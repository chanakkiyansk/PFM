from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# 🧾 In-memory database (replace with real DB later)
expenses = []

# 📊 Helper: Get monthly totals
def get_monthly_totals():
    monthly = {}
    for e in expenses:
        month = e["date"][:7]  # YYYY-MM
        monthly[month] = monthly.get(month, 0) + e["amount"]
    return monthly

# 🔮 Prediction logic
def predict_next_month():
    monthly = get_monthly_totals()
    amounts = list(monthly.values())

    if len(amounts) < 2:
        return "Not enough data"

    avg = sum(amounts) / len(amounts)
    trend = amounts[-1] - amounts[0]

    prediction = avg + (trend / len(amounts))
    return round(prediction, 2)

# 📈 Category-wise summary
def category_summary():
    summary = {}
    for e in expenses:
        cat = e["category"]
        summary[cat] = summary.get(cat, 0) + e["amount"]
    return summary

# 🤖 Chatbot API
@app.route('/chat', methods=['POST'])
def chat():
    user_msg = request.json.get("message", "").lower().strip()

    # ➕ Add Expense
    if user_msg.startswith("add expense"):
        try:
            parts = user_msg.split()

            date = parts[2]
            category = parts[3]
            amount = float(parts[4])

            # validate date
            datetime.strptime(date, "%Y-%m-%d")

            expenses.append({
                "date": date,
                "category": category,
                "amount": amount
            })

            reply = f"✅ Added: {category} ₹{amount} on {date}"

        except:
            reply = "❌ Use: add expense YYYY-MM-DD category amount"

    # 📊 Prediction
    elif "predict" in user_msg or "next month" in user_msg:
        result = predict_next_month()
        reply = f"📊 Next month prediction: ₹{result}"

    # 📈 Average
    elif "average" in user_msg:
        if not expenses:
            reply = "No data available"
        else:
            total = sum(e["amount"] for e in expenses)
            avg = total / len(expenses)
            reply = f"📈 Average expense: ₹{round(avg,2)}"

    # 📂 Category Summary
    elif "category" in user_msg:
        summary = category_summary()
        if not summary:
            reply = "No data"
        else:
            reply = "📂 Category Spending:\n"
            for k, v in summary.items():
                reply += f"{k}: ₹{v}\n"

    # 📋 Show Expenses
    elif "show" in user_msg:
        if not expenses:
            reply = "No expenses yet"
        else:
            reply = "\n".join(
                [f"{e['date']} | {e['category']} | ₹{e['amount']}" for e in expenses]
            )

    # ⚠️ Overspending Alert
    elif "alert" in user_msg:
        predicted = predict_next_month()
        if isinstance(predicted, str):
            reply = predicted
        elif predicted > 15000:
            reply = f"⚠️ Warning! You may overspend: ₹{predicted}"
        else:
            reply = f"✅ You are within budget. Predicted: ₹{predicted}"

    # 🤖 Default
    else:
        reply = (
            "🤖 Try commands:\n"
            "- add expense 2026-03-10 food 500\n"
            "- predict\n"
            "- average\n"
            "- category\n"
            "- show\n"
            "- alert"
        )

    return jsonify({"reply": reply})


# 🏠 Home route
@app.route('/')
def home():
    return "🤖 Finance Chatbot Running 🚀"

if __name__ == '__main__':
    app.run(debug=True)


    
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq
import json
import os
import requests
from datetime import datetime


app = Flask(__name__)
CORS(app)

load_dotenv()


# =========================================================
# CONFIGURATION
# =========================================================

# KisanSetu Django backend
DJANGO_API_URL = "http://127.0.0.1:8000"

# Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# =========================================================
# LOAD MOCK DATA
# =========================================================

with open("data/mockData.json", "r", encoding="utf-8") as file:
    farmer_data = json.load(file)


# =========================================================
# LANGUAGE DETECTION
# =========================================================

def is_bengali(text):

    bengali_chars = set(
        "অআইঈউঊঋএঐওঔ"
        "কখগঘঙচছজঝঞ"
        "টঠডঢণতথদধন"
        "পফবভমযরলশষসহ"
        "ািীুূৃেৈোৌ্"
    )

    return any(ch in bengali_chars for ch in text)


# =========================================================
# FIND CURRENT ACTIVE BOOKING
# Same logic used by Queue.jsx
# =========================================================

def get_current_active_booking(bookings):

    active_bookings = [
        booking
        for booking in bookings
        if booking.get("status")
        in ["APPROVED", "IN_PROGRESS"]
    ]

    if not active_bookings:
        return None


    # -----------------------------------------------------
    # Sort:
    # 1. Earliest booking date
    # 2. Smaller token number
    # 3. Smaller booking ID
    # -----------------------------------------------------

    def sort_key(booking):

        booking_date = booking.get("booking_date")

        try:

            date_value = datetime.strptime(
                booking_date,
                "%Y-%m-%d"
            )

        except Exception:

            date_value = datetime.max


        token_number = booking.get("token_number")

        if token_number:

            try:

                token_value = int(
                    str(token_number).split("-")[-1]
                )

            except Exception:

                token_value = 999999999

        else:

            token_value = 999999999


        try:

            booking_id = int(
                booking.get("booking_id", 999999999)
            )

        except Exception:

            booking_id = 999999999


        return (
            date_value,
            token_value,
            booking_id
        )


    active_bookings.sort(
        key=sort_key
    )


    return active_bookings[0]


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():

    return "Kisan Setu AI Backend Running"


# =========================================================
# CHAT API
# =========================================================

@app.route("/api/chat", methods=["POST"])
def chat():

    data = request.get_json()


    if not data:

        return jsonify({
            "reply": "No message received."
        }), 400


    # User message
    message = data.get(
        "message",
        ""
    ).strip()


    # Logged-in farmer ID coming from React
    farmer_id = data.get(
        "farmerId"
    )


    if not message:

        return jsonify({
            "reply": "Please enter a message."
        }), 400


    bengali = is_bengali(message)


    # =====================================================
    # GET REAL FARMER BOOKINGS FROM DJANGO
    # =====================================================

    real_bookings = []


    print(
        "FARMER ID RECEIVED:",
        farmer_id
    )


    if farmer_id:

        try:

            response = requests.get(
                f"{DJANGO_API_URL}/api/bookings/farmer/{farmer_id}/",
                timeout=5
            )


            print(
                "DJANGO STATUS:",
                response.status_code
            )


            print(
                "DJANGO RESPONSE:",
                response.text
            )


            if response.ok:

                real_bookings = response.json()


                print(
                    "REAL BOOKINGS:",
                    real_bookings
                )


        except Exception as e:

            print(
                "DJANGO API ERROR:",
                e
            )


    # =====================================================
    # FIND CURRENT ACTIVE BOOKING
    # =====================================================

    current_booking = get_current_active_booking(
        real_bookings
    )


    # =====================================================
    # TOKEN
    # =====================================================

    if (
        "token" in message.lower()
        or "টোকেন" in message
    ):

        if current_booking:

            token_number = current_booking.get(
                "token_number"
            )


            if token_number is not None:

                if bengali:

                    reply = (
                        f"আপনার বর্তমান টোকেন নম্বর "
                        f"{token_number}।"
                    )

                else:

                    reply = (
                        f"Your current token number is "
                        f"{token_number}."
                    )


            else:

                if bengali:

                    reply = (
                        "আপনার টোকেন নম্বর এখনও "
                        "নির্ধারণ করা হয়নি।"
                    )

                else:

                    reply = (
                        "Your token number has not "
                        "been assigned yet."
                    )


        elif real_bookings:

            if bengali:

                reply = (
                    "আপনার কোনো সক্রিয় বুকিং নেই।"
                )

            else:

                reply = (
                    "You do not have an active booking."
                )


        else:

            if bengali:

                reply = (
                    "আপনার বুকিং তথ্য বর্তমানে "
                    "পাওয়া যাচ্ছে না।"
                )

            else:

                reply = (
                    "Your booking information is "
                    "currently unavailable."
                )


    # =====================================================
    # BOOKING
    # =====================================================

    elif (
        "booking" in message.lower()
        or "বুকিং" in message
    ):

        if current_booking:

            booking_id = current_booking.get(
                "booking_id"
            )


            if bengali:

                reply = (
                    f"আপনার বর্তমান বুকিং আইডি "
                    f"{booking_id}।"
                )

            else:

                reply = (
                    f"Your current booking ID is "
                    f"{booking_id}."
                )


        elif real_bookings:

            if bengali:

                reply = (
                    "আপনার কোনো সক্রিয় বুকিং নেই।"
                )

            else:

                reply = (
                    "You do not have an active booking."
                )


        else:

            if bengali:

                reply = (
                    "আপনার বুকিং তথ্য বর্তমানে "
                    "পাওয়া যাচ্ছে না।"
                )

            else:

                reply = (
                    "Your booking information is "
                    "currently unavailable."
                )


    # =====================================================
    # PAYMENT
    # =====================================================

    elif (
        "payment" in message.lower()
        or "পেমেন্ট" in message
    ):

        # Payment is still using mock data for now

        payment_status = farmer_data.get(
            "paymentStatus",
            "Unknown"
        )


        if bengali:

            reply = (
                f"আপনার পেমেন্ট স্ট্যাটাস "
                f"{payment_status}।"
            )

        else:

            reply = (
                f"Your payment status is "
                f"{payment_status}."
            )


    # =====================================================
    # QUEUE
    # =====================================================

    elif (
        "queue" in message.lower()
        or "সারি" in message
        or "কতজন আগে" in message
        or "আমার অবস্থান" in message
    ):

        if current_booking:

            booking_id = current_booking.get(
                "booking_id"
            )


            print(
                "CURRENT QUEUE BOOKING ID:",
                booking_id
            )


            try:

                queue_response = requests.get(
                    f"{DJANGO_API_URL}/api/queue/{booking_id}/",
                    timeout=5
                )


                print(
                    "QUEUE API STATUS:",
                    queue_response.status_code
                )


                print(
                    "QUEUE API RESPONSE:",
                    queue_response.text
                )


                if queue_response.ok:

                    queue_data = queue_response.json()


                    queue_position = queue_data.get(
                        "queue_position"
                    )

                    people_ahead = queue_data.get(
                        "people_ahead"
                    )

                    estimated_wait = queue_data.get(
                        "estimated_wait_minutes"
                    )

                    estimated_turn = queue_data.get(
                        "estimated_turn_time"
                    )

                    queue_status = queue_data.get(
                        "status"
                    )

                    token_number = queue_data.get(
                        "token_number"
                    )


                    # -------------------------------------------------
                    # BENGALI RESPONSE
                    # -------------------------------------------------

                    if bengali:

                        reply_parts = []


                        if token_number:

                            reply_parts.append(
                                f"আপনার টোকেন নম্বর "
                                f"{token_number}।"
                            )


                        if queue_position is not None:

                            reply_parts.append(
                                f"সারিতে আপনার অবস্থান "
                                f"{queue_position}।"
                            )


                        if people_ahead is not None:

                            reply_parts.append(
                                f"আপনার আগে "
                                f"{people_ahead} জন আছেন।"
                            )


                        if estimated_wait is not None:

                            if estimated_wait == 0:

                                reply_parts.append(
                                    "আপনার পালা এখন।"
                                )

                            else:

                                reply_parts.append(
                                    f"আনুমানিক অপেক্ষার সময় "
                                    f"{estimated_wait} মিনিট।"
                                )


                        if estimated_turn:

                            reply_parts.append(
                                f"আনুমানিক পালার সময় "
                                f"{estimated_turn}।"
                            )


                        if queue_status:

                            reply_parts.append(
                                f"বর্তমান স্ট্যাটাস "
                                f"{queue_status}।"
                            )


                        if reply_parts:

                            reply = " ".join(
                                reply_parts
                            )

                        else:

                            reply = (
                                "আপনার সারির তথ্য "
                                "বর্তমানে পাওয়া যাচ্ছে না।"
                            )


                    # -------------------------------------------------
                    # ENGLISH RESPONSE
                    # -------------------------------------------------

                    else:

                        reply_parts = []


                        if token_number:

                            reply_parts.append(
                                f"Your token number is "
                                f"{token_number}."
                            )


                        if queue_position is not None:

                            reply_parts.append(
                                f"Your current queue "
                                f"position is "
                                f"{queue_position}."
                            )


                        if people_ahead is not None:

                            reply_parts.append(
                                f"There are "
                                f"{people_ahead} people "
                                f"ahead of you."
                            )


                        if estimated_wait is not None:

                            if estimated_wait == 0:

                                reply_parts.append(
                                    "It is your turn now."
                                )

                            else:

                                reply_parts.append(
                                    f"Estimated waiting time "
                                    f"is about "
                                    f"{estimated_wait} minutes."
                                )


                        if estimated_turn:

                            reply_parts.append(
                                f"Estimated turn time is "
                                f"{estimated_turn}."
                            )


                        if queue_status:

                            reply_parts.append(
                                f"Current status is "
                                f"{queue_status}."
                            )


                        if reply_parts:

                            reply = " ".join(
                                reply_parts
                            )

                        else:

                            reply = (
                                "Your queue information "
                                "is currently unavailable."
                            )


                else:

                    if bengali:

                        reply = (
                            "আপনার সারির তথ্য বর্তমানে "
                            "পাওয়া যাচ্ছে না।"
                        )

                    else:

                        reply = (
                            "Your queue information "
                            "is currently unavailable."
                        )


            except Exception as e:

                print(
                    "QUEUE API ERROR:",
                    e
                )


                if bengali:

                    reply = (
                        "সারির তথ্য পাওয়ার সময় "
                        "একটি সমস্যা হয়েছে।"
                    )

                else:

                    reply = (
                        "There was a problem retrieving "
                        "your queue information."
                    )


        elif real_bookings:

            if bengali:

                reply = (
                    "আপনার কোনো সক্রিয় বুকিং নেই।"
                )

            else:

                reply = (
                    "You do not have an active booking."
                )


        else:

            if bengali:

                reply = (
                    "আপনার বুকিং তথ্য বর্তমানে "
                    "পাওয়া যাচ্ছে না।"
                )

            else:

                reply = (
                    "Your booking information is "
                    "currently unavailable."
                )


    # =====================================================
    # PRICE
    # =====================================================

    elif (
        "price" in message.lower()
        or "দাম" in message
    ):

        # Price is still using mock data for now

        procurement_price = farmer_data.get(
            "procurementPrice"
        )


        if procurement_price is not None:

            if bengali:

                reply = (
                    f"বর্তমান সংগ্রহ মূল্য "
                    f"{procurement_price} টাকা।"
                )

            else:

                reply = (
                    f"Current procurement price is "
                    f"₹{procurement_price}."
                )


        else:

            if bengali:

                reply = (
                    "বর্তমান সংগ্রহ মূল্য "
                    "তথ্যে পাওয়া যাচ্ছে না।"
                )

            else:

                reply = (
                    "The current procurement price "
                    "is not available."
                )


    # =====================================================
    # CENTRE
    # =====================================================

    elif (
        "centre" in message.lower()
        or "center" in message.lower()
        or "কেন্দ্র" in message
    ):

        if current_booking:

            centre_name = current_booking.get(
                "centre_name"
            )


            if centre_name:

                if bengali:

                    reply = (
                        f"আপনার সংগ্রহ কেন্দ্র "
                        f"{centre_name}।"
                    )

                else:

                    reply = (
                        f"Your procurement centre is "
                        f"{centre_name}."
                    )


            else:

                if bengali:

                    reply = (
                        "আপনার সংগ্রহ কেন্দ্রের তথ্য "
                        "পাওয়া যাচ্ছে না।"
                    )

                else:

                    reply = (
                        "Your procurement centre "
                        "information is not available."
                    )


        elif real_bookings:

            if bengali:

                reply = (
                    "আপনার কোনো সক্রিয় বুকিং নেই।"
                )

            else:

                reply = (
                    "You do not have an active booking."
                )


        else:

            if bengali:

                reply = (
                    "আপনার বুকিং তথ্য বর্তমানে "
                    "পাওয়া যাচ্ছে না।"
                )

            else:

                reply = (
                    "Your booking information is "
                    "currently unavailable."
                )


    # =====================================================
    # SLOT BOOKING
    # =====================================================

    elif (
        "slot" in message.lower()
        or "book slot" in message.lower()
        or "স্লট" in message
    ):

        if bengali:

            reply = (
                "Kisan-Setu ওয়েবসাইটে লগইন করুন। "
                "তারপর Book a Slot বিভাগে যান, "
                "ফসল ও সংগ্রহ কেন্দ্র নির্বাচন করুন, "
                "একটি উপলব্ধ স্লট নির্বাচন করুন এবং "
                "বুকিং নিশ্চিত করুন।"
            )

        else:

            reply = (
                "Log in to the Kisan-Setu website "
                "as a farmer. Open Book a Slot, "
                "select your crop and procurement centre, "
                "choose an available slot, and confirm "
                "your booking. You can then check it "
                "under My Booking."
            )


    # =====================================================
    # DOCUMENTS
    # =====================================================

    elif (
        "document" in message.lower()
        or "documents" in message.lower()
        or "ডকুমেন্ট" in message
    ):

        docs = ", ".join(
            farmer_data.get(
                "documents",
                []
            )
        )


        if bengali:

            reply = (
                f"প্রয়োজনীয় ডকুমেন্ট: {docs}"
            )

        else:

            reply = (
                f"Required documents: {docs}"
            )


    # =====================================================
    # PROCUREMENT PROCESS
    # =====================================================

    elif (
        "procurement process" in message.lower()
        or "procurement procedure" in message.lower()
    ):

        if bengali:

            reply = (
                "Kisan-Setu-তে প্রথমে লগইন করুন, "
                "স্লট বুক করুন, নির্ধারিত সংগ্রহ "
                "কেন্দ্রে ফসল জমা দিন এবং "
                "পেমেন্টের স্ট্যাটাস দেখুন।"
            )

        else:

            reply = (
                "Log in to Kisan-Setu, book a "
                "procurement slot, deliver your crop "
                "at the scheduled procurement centre, "
                "and check your payment status."
            )


    # =====================================================
    # AI FALLBACK
    # =====================================================

    else:

        try:

            response = client.chat.completions.create(

                model="openai/gpt-oss-20b",

                messages=[

                    {
                        "role": "system",

                        "content": """
You are Kisan-Setu AI Assistant.

You are an AI assistant for the Kisan-Setu farmer
procurement web application.

Kisan-Setu helps farmers with:

- Booking crop procurement slots
- Selecting a crop
- Selecting a procurement centre
- Viewing procurement prices
- Viewing booking information
- Tracking token and queue position
- Checking procurement information
- Checking payment status
- Viewing required documents
- Receiving notifications related to bookings,
  procurement and payments

IMPORTANT RULES:

1. Never invent features, services, bookings,
   prices, dates, times, locations, or other
   information about Kisan-Setu.

2. Kisan-Setu does not provide tractor rental,
   expert consultation, soil testing, marketplace
   services, or other unrelated services unless
   explicitly provided.

3. Kisan-Setu is currently a web application.
   Do not describe it as a mobile app.

4. If the user asks how to book a procurement slot,
   explain this actual process:

   - Log in to the Kisan-Setu website as a farmer.
   - Open Book a Slot.
   - Select the crop.
   - Select the procurement centre.
   - Select an available slot.
   - Confirm the booking.
   - Check the booking under My Booking.

5. Never invent personal farmer information.

6. If information is not available in the provided
   data, clearly say that the information is
   currently unavailable.

7. Do not claim that Kisan-Setu is an official
   government application unless explicitly provided.

8. For general agriculture, education, technology,
   science, geography and general knowledge questions,
   provide helpful and concise answers.

9. Language rules:

   - Reply in English when the user writes in English.
   - Reply in Bengali when the user writes in Bengali.
   - Do not reply in Hindi unless explicitly asked.

10. Keep answers short, clear and farmer-friendly.

Never make up information about Kisan-Setu.
"""
                    },


                    {
                        "role": "user",
                        "content": message
                    }

                ]

            )


            reply = response.choices[0].message.content


        except Exception as e:

            print(
                "AI ERROR:",
                e
            )


            if bengali:

                reply = (
                    "AI পরিষেবা বর্তমানে উপলব্ধ নয়।"
                )

            else:

                reply = (
                    "AI service is currently unavailable."
                )


    # =====================================================
    # RETURN RESPONSE
    # =====================================================

    return jsonify({
        "reply": reply
    })


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )
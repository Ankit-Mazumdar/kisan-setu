import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import { useTranslation } from "../../translation/useTranslation";
import { useAuth } from "../../context/AuthContext";

import "./Chatbot.css";


function Chatbot() {

  const { language } = useTranslation();
  const { farmer } = useAuth();


  /* =====================================================
     CHAT STATE
  ===================================================== */

  const [isChatOpen, setIsChatOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const [connectionError, setConnectionError] = useState(false);

  const [lastMessage, setLastMessage] = useState("");


  /* =====================================================
     ROBOT DRAG STATE
  ===================================================== */

  /*
   * null = use CSS position
   *
   * This means the robot initially appears
   * at bottom-right.
   */

  const [robotPosition, setRobotPosition] = useState(null);


  const robotButtonRef = useRef(null);

  const dragStart = useRef({
    x: 0,
    y: 0,
  });

  const initialPosition = useRef({
    x: 0,
    y: 0,
  });

  const hasDragged = useRef(false);

  const isDragging = useRef(false);


  /* =====================================================
     TRANSLATIONS
  ===================================================== */

  const translations = {

    en: {

      greeting:
        "Hello! 👋 I am Kisan-Setu AI. How can I help you today?",

      chatbotStatus:
        "Online • Ready to help",

      inputPlaceholder:
        "Type your question...",

      typing:
        "Kisan-Setu is typing",

      connectionTitle:
        "Connection problem",

      connectionText:
        "Kisan-Setu AI is temporarily unavailable. Please make sure the server is running and try again.",

      tryAgain:
        "Try Again",
    },


    bn: {

      greeting:
        "নমস্কার! 👋 আমি কিষান-সেতু AI। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",

      chatbotStatus:
        "অনলাইন • সাহায্যের জন্য প্রস্তুত",

      inputPlaceholder:
        "আপনার প্রশ্ন লিখুন...",

      typing:
        "কিষান-সেতু লিখছে",

      connectionTitle:
        "সংযোগ সমস্যা",

      connectionText:
        "কিষান-সেতু AI বর্তমানে উপলব্ধ নয়। সার্ভার চালু আছে কিনা দেখে আবার চেষ্টা করুন।",

      tryAgain:
        "আবার চেষ্টা করুন",
    },

  };


  const text =
    translations[language] || translations.en;


  /* =====================================================
     CHAT MESSAGES
  ===================================================== */

  const [messages, setMessages] = useState([

    {
      sender: "bot",
      text: text.greeting,
    },

  ]);


  /* =====================================================
     DRAG ROBOT
  ===================================================== */

  const handlePointerDown = (event) => {

    /*
     * Only drag with primary mouse button.
     * Touch devices also work because pointer events
     * are used.
     */

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }


    const button = robotButtonRef.current;

    if (!button) {
      return;
    }


    const rect = button.getBoundingClientRect();


    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
    };


    initialPosition.current = {
      x: rect.left,
      y: rect.top,
    };


    hasDragged.current = false;

    isDragging.current = true;


    button.classList.add("dragging");

    button.setPointerCapture?.(event.pointerId);

  };


  const handlePointerMove = (event) => {

    if (!isDragging.current) {
      return;
    }


    const deltaX =
      event.clientX - dragStart.current.x;


    const deltaY =
      event.clientY - dragStart.current.y;


    /*
     * If movement is more than a few pixels,
     * consider it a drag instead of a click.
     */

    if (
      Math.abs(deltaX) > 5 ||
      Math.abs(deltaY) > 5
    ) {

      hasDragged.current = true;

    }


    if (!hasDragged.current) {
      return;
    }


    const button =
      robotButtonRef.current;


    if (!button) {
      return;
    }


    const buttonWidth =
      button.offsetWidth;


    const buttonHeight =
      button.offsetHeight;


    const maxX =
      window.innerWidth - buttonWidth - 5;


    const maxY =
      window.innerHeight - buttonHeight - 5;


    let newX =
      initialPosition.current.x + deltaX;


    let newY =
      initialPosition.current.y + deltaY;


    /*
     * Keep robot inside the screen.
     */

    newX =
      Math.max(
        5,
        Math.min(newX, maxX)
      );


    newY =
      Math.max(
        5,
        Math.min(newY, maxY)
      );


    setRobotPosition({
      x: newX,
      y: newY,
    });

  };


  const handlePointerUp = (event) => {

    if (!isDragging.current) {
      return;
    }


    isDragging.current = false;


    const button =
      robotButtonRef.current;


    if (button) {

      button.classList.remove("dragging");

      button.releasePointerCapture?.(
        event.pointerId
      );

    }

  };


  /* =====================================================
     OPEN CHAT
  ===================================================== */

  const handleRobotClick = () => {

    /*
     * If the user dragged the robot,
     * don't open the chatbot.
     */

    if (hasDragged.current) {

      hasDragged.current = false;

      return;

    }


    setIsChatOpen(true);

  };


  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const sendMessage = async (
    messageToSend = message
  ) => {

    if (
      !messageToSend.trim() ||
      isTyping
    ) {

      return;

    }


    setMessages((prev) => [

      ...prev,

      {
        sender: "user",
        text: messageToSend,
      },

    ]);


    setMessage("");

    setLastMessage(messageToSend);

    setConnectionError(false);

    setIsTyping(true);


    const startTime =
      Date.now();


    try {

      const response =
        await fetch(
          "http://127.0.0.1:5000/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              message:
                messageToSend,

              farmerId:
                farmer?.farmerId,

            }),

          }
        );


      if (!response.ok) {

        throw new Error(
          "Server error"
        );

      }


      const data =
        await response.json();


      const elapsedTime =
        Date.now() - startTime;


      /*
       * Keep a small typing delay
       * so the chatbot feels natural.
       */

      const remainingTime =
        Math.max(
          0,
          1500 - elapsedTime
        );


      setTimeout(() => {

        setMessages((prev) => [

          ...prev,

          {
            sender: "bot",
            text: data.reply,
          },

        ]);


        setIsTyping(false);

      }, remainingTime);


    } catch (error) {

      console.error(
        "Chatbot connection error:",
        error
      );


      const elapsedTime =
        Date.now() - startTime;


      const remainingTime =
        Math.max(
          0,
          1500 - elapsedTime
        );


      setTimeout(() => {

        setConnectionError(true);

        setIsTyping(false);

      }, remainingTime);

    }

  };


  /* =====================================================
     TRY AGAIN
  ===================================================== */

  const handleTryAgain = () => {

    if (lastMessage) {

      sendMessage(lastMessage);

    }

  };


  /* =====================================================
     CLEANUP POINTER EVENTS
  ===================================================== */

  useEffect(() => {

    const handleWindowPointerUp = () => {

      if (isDragging.current) {

        isDragging.current = false;

        const button =
          robotButtonRef.current;

        if (button) {

          button.classList.remove(
            "dragging"
          );

        }

      }

    };


    window.addEventListener(
      "pointerup",
      handleWindowPointerUp
    );


    return () => {

      window.removeEventListener(
        "pointerup",
        handleWindowPointerUp
      );

    };

  }, []);


  /* =====================================================
     ROBOT POSITION STYLE
  ===================================================== */

  const robotStyle =
    robotPosition
      ? {
          left: `${robotPosition.x}px`,
          top: `${robotPosition.y}px`,
          right: "auto",
          bottom: "auto",
        }
      : {};


  /* =====================================================
     RETURN
  ===================================================== */

  return (

    <>

      {/* =================================================
          FLOATING ROBOT
      ================================================= */}

      {!isChatOpen && (

        <button

          ref={robotButtonRef}

          className="chatbot-button"

          style={robotStyle}

          onClick={handleRobotClick}

          onPointerDown={
            handlePointerDown
          }

          onPointerMove={
            handlePointerMove
          }

          onPointerUp={
            handlePointerUp
          }

          aria-label="Open Kisan-Setu AI"

        >

          <img
            src="/chatbot-robot.png"
            alt="Kisan-Setu AI"
            draggable="false"
          />

        </button>

      )}


      {/* =================================================
          CHAT WINDOW
      ================================================= */}

      {isChatOpen && (

        <div className="chatbot-window">


          {/* =============================================
              HEADER
          ============================================= */}

          <div className="chatbot-header">


            <div className="chatbot-title">


              <div className="chatbot-avatar">

                <img
                  src="/chatbot-robot.png"
                  alt=""
                  draggable="false"
                />

              </div>


              <div>

                <h3>
                  Kisan-Setu AI
                </h3>


                <div className="chatbot-status">

                  <span className="status-dot"></span>

                  {text.chatbotStatus}

                </div>

              </div>


            </div>


            <button

              className="close-button"

              onClick={() =>
                setIsChatOpen(false)
              }

              aria-label="Close chatbot"

            >

              ✕

            </button>


          </div>


          {/* =============================================
              CHAT BODY
          ============================================= */}

          <div className="chatbot-body">


            {messages.map(
              (msg, index) => (

                <div

                  key={index}

                  className={
                    msg.sender === "bot"
                      ? "bot-message"
                      : "user-message"
                  }

                >

                  {msg.sender === "bot" ? (

                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>

                  ) : (

                    msg.text

                  )}

                </div>

              )
            )}


            {/* ===========================================
                TYPING
            =========================================== */}

            {isTyping && (

              <div className="typing-message">

                <span className="typing-text">

                  {text.typing}

                </span>


                <div className="typing-dots">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>

            )}


            {/* ===========================================
                CONNECTION ERROR
            =========================================== */}

            {connectionError &&
              !isTyping && (

                <div className="connection-error">


                  <div className="error-icon">
                    ⚠️
                  </div>


                  <div className="error-content">


                    <strong>
                      {text.connectionTitle}
                    </strong>


                    <p>
                      {text.connectionText}
                    </p>


                    <button

                      className="retry-button"

                      onClick={
                        handleTryAgain
                      }

                    >

                      🔄 {text.tryAgain}

                    </button>


                  </div>


                </div>

              )}


          </div>


          {/* =============================================
              INPUT
          ============================================= */}

          <div className="chatbot-input">


            <input

              type="text"

              value={message}

              placeholder={
                text.inputPlaceholder
              }

              disabled={isTyping}

              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }

              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  sendMessage();

                }

              }}

            />


            <button

              className="send-button"

              disabled={
                !message.trim() ||
                isTyping
              }

              onClick={() =>
                sendMessage()
              }

              aria-label="Send message"

            >

              ➤

            </button>


          </div>


        </div>

      )}

    </>

  );

}


export default Chatbot;
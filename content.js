// Extract the question text from the Stack Overflow post
function getQuestionText() {
    const questionElement = document.getElementsByClassName('s-prose js-post-body')[0];
    return questionElement ? questionElement.innerHTML.replace(/\s\s+/g, ' ').trim() : null;
}


function addTypingEffect(responseText, targetElement) {
    const words = responseText.split(" "); // Split the response into words
    let index = 0;

    // Clear any existing content
    targetElement.innerHTML = '';

    function typeNextWord() {
        if (index < words.length) {
            // Append the next word to the element
            targetElement.innerHTML += words[index] + " ";
            index++;

            // Set a delay before the next word is added (500ms is an example delay)
            setTimeout(typeNextWord, 75);
        }
    }

    // Start the typing effect
    typeNextWord();
}

function formatResponse(rawText) {
    // Step 1: Replace \n with <br> for new lines
    let formattedText = rawText.replace(/\n/g, '<br>');

    // Step 2: Replace **bold text** with <strong> tags for full phrases
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
        return '<b>' + p1 + '</b>';
    });

    // Step 3: Replace *italic text* with <em> tags
    formattedText = formattedText.replace(/\*(.*?)\*/g, (match, p1) => {
        return '<i>' + p1 + '</i>';
    });

    return formattedText;
}






function addResponseToPage(responseText) {
    const formattedResponse = formatResponse(responseText);

    const questionElement = document.getElementsByClassName('post-layout ')[0];

    if (questionElement) {
        // Create a div for the AI response
        const responseDiv = document.createElement("div");

        // Styling the container div
        responseDiv.style.marginTop = "20px";
        responseDiv.style.padding = "20px";
        responseDiv.style.border = "1px solid #ccc";
        responseDiv.style.fontFamily = "Arial, sans-serif";
        responseDiv.style.fontSize = "16px";
        responseDiv.style.lineHeight = "1.6";
        responseDiv.style.borderRadius = "15px";
        responseDiv.style.position = "relative";
        responseDiv.style.minHeight = "60px";
        responseDiv.style.paddingLeft = "60px";
        responseDiv.style.background = "url('https://static.vecteezy.com/system/resources/previews/021/608/790/non_2x/chatgpt-logo-chat-gpt-icon-on-black-background-free-vector.jpg') no-repeat 10px 10px";
        responseDiv.style.backgroundSize = "40px 40px";
        responseDiv.style.backgroundColor = "#f8f9f9";


        // Use formatted response
        responseDiv.innerHTML = formattedResponse;

        // Insert the response div below the question
        questionElement.parentNode.insertBefore(responseDiv, questionElement.nextSibling);

        // Optionally add a typing effect
        addTypingEffect(formattedResponse, responseDiv);
    }
}


//

// Main logic
const questionText = getQuestionText();

// Add the extra line to the question text
const additionalLine = "\nPlease give the answer from an energy efficiency perspective.";
const updatedQuestionText = questionText + additionalLine;

console.log(updatedQuestionText); // Log the updated question text

// Send the updated question text to the backend for AI response
if (updatedQuestionText) {
    chrome.runtime.sendMessage(
        { action: "fetchGeminiResponse", query: updatedQuestionText },
        (response) => {
            console.log(response);
            if (response.error) {
                console.error("Error fetching AI response:", response.error);
            } else {
                addResponseToPage(response.response);
            }
        }
    );
}


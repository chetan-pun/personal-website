let chat_history = []



//slide animation in projects section
const images = document.querySelectorAll('.slider img');
let counter = 1;
setInterval(() => {
    images.forEach(img => img.style.transform = `translateX(-${counter * 100}%)`);
    counter++;

    if (counter ===images.length/3) counter = 0;
}, 2000);


document.getElementById('research').addEventListener('click',function(){

  const inputfield = document.getElementById('userInput');
  inputfield.value = "Tell me about Chetan's research?"
  sendMessage()

})

document.getElementById('purpose').addEventListener('click',function(){

  const inputfield = document.getElementById('userInput');
  inputfield.value = "What's your purpose?"
  sendMessage()

})

document.getElementById('chetan').addEventListener('click',function(){

  const inputfield = document.getElementById('userInput');
  inputfield.value = "Who is Chetan?"
  sendMessage()

})

//handle chat dialogue
document.getElementById('sendMessage').addEventListener('click', sendMessage);
  document.getElementById('userInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

 async function sendMessage() {
   const chatboxMessages = document.getElementById('chatboxMessages');
    console.log('clicked')
    const userInput = document.getElementById('userInput');
    const img = document.createElement('img');
    img.src = './assets/icons8-loading.gif'; 
    img.alt = 'loading';
    const message = userInput.value.trim();

    if (message) {
      appendMessage('user', message);
      chatboxMessages.appendChild(img)
      userInput.value = '';
      await fetch('https://api.ticketsewa.com.np/ai/chat', {
        method: 'POST',  // Specify the method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: message,
          chat_history 
        }),
      })
        .then(response => response.json())
        .then((data)=>{
          chatboxMessages.removeChild(img)
          appendMessage('bot',data.response,message, true);
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }

  function appendMessage(sender, message,user_prompt ,isResponse = false) {
    const chatboxMessages = document.getElementById('chatboxMessages');
    const messageElement = document.createElement('div');


    messageElement.classList.add('p-2', 'rounded-lg', 'mb-2');
    messageElement.style.maxWidth = '60%';
    messageElement.style.width = 'fit-content';

    if (sender === 'user') {
      messageElement.textContent = message;
      chatboxMessages.appendChild(messageElement);
      chat_history.push({user : user_prompt ,response : message})
      messageElement.classList.add('bg-secondary','text-black', 'self-end', 'text-right', 'ml-auto');
    } else if (isResponse) {
      messageElement.classList.add('bg-black', 'text-white', 'self-start', 'text-left', 'mr-auto');
      messageElement.textContent = message.response;
      chat_history.push({user :  user_prompt, response : message.response})
      chatboxMessages.appendChild(messageElement);
      if (message.links !==null) {
        console.log('interes')
        for(const item of message.links){
          console.log(item.link_url)
          const linkElement = document.createElement('a');
          linkElement.href = item.link_url;
          linkElement.textContent = item.name;
          linkElement.classList.add('ml-4','underline','pointer')
          messageElement.appendChild(linkElement);
        }      
      } else {
        messageElement.textContent = message.response;
      }
    } else {
      messageElement.classList.add('bg-yellow-500', 'self-start', 'text-left', 'mr-auto');
    }

    chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
  }


function copyEmail(){
  navigator.clipboard.writeText("chetan.6.pun@gmail.com")
  .then(() => {
    document.getElementById("copyMessage").innerText = "Text copied to clipboard!";
  })

  setTimeout(() => {
    document.getElementById("copyMessage").innerText = "";
  }, 1000);
}


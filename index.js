

//slide animation in projects section
const images = document.querySelectorAll('.slider img');
let counter = 1;
setInterval(() => {
    images.forEach(img => img.style.transform = `translateX(-${counter * 100}%)`);
    counter++;
    console.log(images.length)
    if (counter ===images.length/3) counter = 0;
}, 2000);



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
      await fetch('https://luna-zgb5.onrender.com', {
        method: 'POST',  // Specify the method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: message,
        }),
      })
        .then(response => response.json())
        .then((data)=>{
          console.log(data)
          chatboxMessages.removeChild(img)
    
          appendMessage('bot',data.response, true);
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }

  function appendMessage(sender, message, isResponse = false) {
    const chatboxMessages = document.getElementById('chatboxMessages');
    const messageElement = document.createElement('div');


    messageElement.classList.add('p-2', 'rounded-lg', 'mb-2');
    messageElement.style.maxWidth = '60%';
    messageElement.style.width = 'fit-content';

    if (sender === 'user') {
      messageElement.classList.add('bg-secondary','text-black', 'self-end', 'text-right', 'ml-auto');
    } else if (isResponse) {
      messageElement.classList.add('bg-black', 'text-white', 'self-start', 'text-left', 'mr-auto');
    } else {
      messageElement.classList.add('bg-yellow-500', 'self-start', 'text-left', 'mr-auto');
    }
    messageElement.textContent = message;
    chatboxMessages.appendChild(messageElement);
    chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
  }





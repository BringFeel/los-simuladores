function leerJSON() {
    fetch('caps.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al leer el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            const urlParams = new URLSearchParams(window.location.search);
            const temp = urlParams.get('temp');
            const cap = urlParams.get('cap');

            if (temp === null || cap === null || cap < 0 || temp > 2 || temp < 1 || temp == 1 && cap > 13 || temp == 2 && cap > 11) {
                var innerDiv = document.querySelector('.player');
                var errorText = document.createElement('h4');
                errorText.innerText = "Parámetros Inválidos o nulos en la Url!"
                innerDiv.insertAdjacentElement('beforeend', errorText);
                return
            }

            document.getElementById('episodie').innerText = `${data[temp][cap].capnumb}`;
            document.getElementById('capTitle').innerText = `${data[temp][cap].title}`;
            document.getElementById('temp').innerText = `${temp}`;

             var innerDiv = document.querySelector('.player');

             var iframe = document.createElement('iframe');

             iframe.src = `${data[temp][cap].urlPlayer}`;
             iframe.frameBorder = '0';
             iframe.width = '30%';
             iframe.height = '315';
             iframe.scrolling = 'no';
             iframe.allowFullscreen = true;
             iframe.webkitAllowFullScreen = true;
             iframe.mozAllowFullScreen = true;
             iframe.allowTransparency = true;
             iframe.allow = "autoplay";

             innerDiv.insertAdjacentElement('beforeend', iframe);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.onload = leerJSON;
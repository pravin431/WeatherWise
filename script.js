const wrapper = document.querySelector(".wrapper"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    weatherPart = wrapper.querySelector(".weather-part"),
    wIcon = weatherPart.querySelector("img"),
    arrowBack = wrapper.querySelector("header i");

inputField.addEventListener("keyup", e => {
    // if user pressed enter btn and input value is not empty
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) { // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city) {
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=66e33f59ba27253e7a6648c428d432d3`;
    fetchData(api);
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords; // getting lat and lon of the user device from coords obj
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=66e33f59ba27253e7a6648c428d432d3`;
    fetchData(api);
}

function onError(error) {
    // if any error occur while getting user location then we'll show it in infoText
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

async function fetchData(api) {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");

    try {
        const response = await fetch(api);
        console.log(response);
        if (!response.ok) {
            let errorMessage;
            if (response.status === 404) {
                errorMessage = "City not found. Please check the city name and try again.";
            } else if (response.status === 401) {
                errorMessage = "Invalid API key. Please verify your API key.";
            } else if (response.status === 500) {
                errorMessage = "Server error. Please try again later.";
            } else {
                // Handle other status codes eg. 400:Bad Request if api url is invalid
                errorMessage = `Unexpected error occurred: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        weatherDetails(data);
    } catch (error) {
        infoTxt.innerText = error;
        infoTxt.classList.replace("pending", "error");
    }
}

function weatherDetails(info) {
    //getting required properties value from the whole weather information
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { temp, feels_like, humidity } = info.main;

    // using custom weather icon according to the id which api gives to us
    if (id == 800) {
        wIcon.src = "icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
        wIcon.src = "icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
        wIcon.src = "icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
        wIcon.src = "icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
        wIcon.src = "icons/cloud.svg";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
        wIcon.src = "icons/rain.svg";
    }

    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

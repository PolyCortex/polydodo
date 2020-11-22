<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/wiki/PolyCortex/polydodo/img/dodo.png" alt="Polydodo" height="200">
  <br>
  Polydodo
  <br>
</h1>

<h4 align="center">A simple automatic sleep scoring tool that uses OpenBCI boards.</h4>

<p align="center">
  <a href="https://polycortex.github.io/polydodo/#/">
    <img src="https://img.shields.io/badge/web-client-9cf?style=for-the-badge&logo=React"
         alt="web client">
  </a>
  <a href="https://github.com/PolyCortex/polydodo/releases/latest/download/polydodo_app_android.apk">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/PolyCortex/polydodo?label=android-apk&logo=android&style=for-the-badge">
  </a>
<img alt="GitHub all releases" src="https://img.shields.io/github/downloads/PolyCortex/polydodo/total?color=orange&label=downloads&style=for-the-badge">
  <a href="http://polycortex.polymtl.ca/">
    <img src="https://img.shields.io/badge/about%20us-%E2%84%B9-blue?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB3VBMVEU4qds2qNo1qNo3qNo5qds4qds3qNo5qds6qtswpdk5qds3qNo3qNo5qds3qNo4qds3qNo1p9o4qds2qNo3qNo4qdszp9o0p9o4qds1p9o7qtuQzuqRz+s7qts2qNpPs981p9rz+vz0+v03qNo2qNpIsN2Ozuoqo9j///////8ro9iLzeqf1e0nodee1e2Nzeoootjt9/vs9vspotiJzOmPz+qMzeqa0+wnodib0+yW0ewvpdkvpdmIy+k7qtuLzeqNzuo7qts4qdsspNhpvuNxweU4qds4qds4qds3qNo8qts3qNovpdkupNk3qNo8qts3qNoxptk4qds2qNotpNlTtN9Qs984qdpUteA5qduy3fH///9vweTD5fTA5POf1e3r9vu84vJuwOQ3qNsqo9iIy+kanNXY7vjX7fchn9aGyukro9g+q9zL6PUyptnc8PjT7PcvpdnJ5/VwweVvweXb7/gwpdkupNltwOSh1u5Ert01p9rc7/hDrd2j1+41qNq+4/O74fI6qtu94vOY0uxKsN4zptrU7PdJsN6a0+xWtuAootje8PnQ6vYendY3qNrB5PNYtuDo9fpStN/M6fXn9PqAyOfi8vnw+Px8xufm9PpYt+A0p9pbuOE6qdveSf6lAAAAUXRSTlMAAAAAAAM1q+j8rjlu/XYCS/38/FCy+/y1Btn+/NoHCd7+8v7gCQne/vrfCAneCQne/v7eCQkJCd4JBdjaB7D8/LRL/fz8T3Z3Oq7p/f3qsDt4St8jAAAAAWJLR0QovbC1sgAAAAd0SU1FB+QLFhI3GjFk5DYAAAEWSURBVBjTY2BgZWRj5+AMDOLk4OJmYmVgYGXm4Q0OCQ0LjwgJjuRj5mdgFogUFIqKjo6JjRMWjBRhZmAWDRKLjY5PSEyKjhVPlmBmkJRKkY5OTUvPyMyKlsmWlWOQV8hRzM3Oyy8ozC5SUlZRZVBTL9YoCckrLSgrT9Ks0NJm0NGt1KiqLqspKA+u1ajT1WPQN0g0DA4qBApE1hs1GJswmBo0GgZHAgVCmuqNmo3NGMwtWjRay9pK29vKOjQ6dS0ZrKy7NGKDu3t6+/onaEy0sWVgsQuxj540ecrUadOjHUIcWRiYnSKdXWZEzYyOnuXqHOnGzMDP4t4UUj17zuS59SHzPFj4Qd719PL2CQr09fMPYGBlAADh2ktDQeyqCAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0xMS0yMlQxODo1NDo1NCswMDowMO6afBwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMTEtMjJUMTg6NTQ6NTQrMDA6MDCfx8SgAAAAAElFTkSuQmCC">
  </a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#learn-more">Learn more</a> •
  <a href="#learn-more">About us</a>
</p>

___

This project aims to offer a cheaper and more accessible way to perform sleep studies from home. To achieve this, a machine learning classifier is used to automate the manual sleep scoring step. This drastically cuts the time needed to process each and every sleep sequences and it completely eliminates the learning curve associated with manual sleep scoring.

🌐 Our web application does exactly all that and is available at [this link](https://polycortex.github.io/polydodo/). Check it out!

🤖 Our Android app is underway. Give us a star to stay tuned for upcoming news about its release!

**This application is not intended for medical purposes and the data it produces should not be used in such context. Its only goal is to help you study your sleep by yourself. Always seek the advice of a physician on any questions regarding a medical condition.**

## Key features

- Compatible with both OpenBCI's Cyton and Ganglion boards.
- Automatic sleep stage scoring based on the AASM's labels.
- A comprehensive guide on how to record polysomnographic EEG data from home.
- A nice and straightforward UI to help you upload, visualize and save your sleep.

## How it works

Polydodo is composed of two client apps, a web one and a mobile one, through which the user can interact. These clients are not complementary but are alternatives to one another. Each of these clients uses the same local server which hosts the automatic sleep stages classification algorithm.

The web client allows the user to upload a data file acquired using an OpenBCI board and then presents him a detailed and personalized analysis of his sleep. Additionally, this client will further detail the process by which we come to classify sleep in stages and offer a review of this process. OpenBCI boards must be configured via OpenBCI GUI and data must be saved on a SD card (Cyton only) or through a session file.

On the other hand, the mobile client offers a tool that can be used on a regular basis. Unlike the web application, this app can save sleep sequences for later consultation and display the aggregated results of several nights of sleep on a dashboard. Also, it will guide the user from the installation of the electrodes, until the end of his acquisition.

Finally, both these clients use a local http server that is easy to installed. This server is local so that your data is not sent over the internet. Biosignals data are sensitive and this is our way to promise you security.
<p align="center">
  <br>
  <img alt="General architecture of the project" src="https://github.com/PolyCortex/polydodo/wiki/img/general_architecture_small.png">
  <br>
<i>Figure 1. Technology diagram with the flow of incoming and outgoing data to clients.</i>
 </p>

As the above diagram states, in the case of the mobile application, the data is received in real time, and in the case of the web application, the data is received asynchronously. In both cases, the data is classified after the end of the acquisition on the local server.

## Project Structure

This project is split into four different folders that represents the four different standalone parts of our project:

- The `ai/` folder contains all of our machine learning prototypes. It mainly consists of a set of notebooks that documents our work. It is there that we trained our sleep stage classification algorithm, validated, tested and serialized it for production. For more information, see [`ai/README.md`](https://github.com/PolyCortex/polydodo/tree/master/ai); and open the notebooks as a lot of documentation is found there;
- The `backend/` folder contains the python server that uses the serialized model from the `ai/` notebooks. This is the local server that must be used with the web app and the mobile app. See [`server/README.md`](https://github.com/PolyCortex/polydodo/tree/master/backend);
- `web/` contains the React web app which is the UI for our project. See [`web/README.md`](https://github.com/PolyCortex/polydodo/tree/master/web) for more info;
- `mobile` contains the Flutter app. This app is an alternative to our web app. It can interface itself directly to the OpenBCI boards which makes it even simpler to proceed to your own sleep analysis. See [`mobile/README.md`](https://github.com/PolyCortex/polydodo/tree/master/mobile) for more info.

## Getting started

### VS Code

- Install VS Code
- Open this project's workspace via the `polydodo.code-workspace` file.
- Install all the project's recommended extensions

For more information about how to get started for each part of the project, see their respective `README.md` file.

## Learn more

For more information, please refer to our [wiki pages](https://github.com/PolyCortex/polydodo/wiki). This is where you'll get all of our official documentation.

## About us

[PolyCortex](http://polycortex.polymtl.ca/) is a student club based at [Polytechnique Montreal](https://www.polymtl.ca/).

The goal of PolyCortex is to develop expertise in neuroscience and engineering to solve neuroengineering problems. This field aims to create technological solutions dedicated to the search for innovative solutions to neuroscience problems.

To do this, we recommend the use of solutions revolving around the design of brain-machine interface devices, the implementation of embedded systems, the use of machine learning and signal processing techniques.

console.log("#-#-#-#-#-# inside emotion rec js");

const video = document.getElementById("video");
console.log("video " + video);

let currentEmotion = "";
let happyToggle = false;
let emotionDuration = { happy: 0, sad: 0, angry: 0, surprised: 0 };
// let emotionDuration = { happy: 0, angry: 0, surprised: 0 };
const statusBarsRef = {
  0: "□□□□",
  1: "■□□□",
  2: "■■□□",
  3: "■■■□",
  4: "■■■■",
  5: "■■■■",
};

/**Don't worry if faceapi is red underlined as "not defined".
 * It gets defined when the index.html file runs, cos just before
 * this file we're in runs, the face-api.min.js file is run (by the
 * index.html file) and that is what makes faceapi to be used below. **/

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("public/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("public/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("public/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("public/models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    // const canvas = faceapi.createCanvasFromMedia(video);
    // const canvasDetections = document.getElementById("canvasDetections");
    // // document.body.append(canvas);
    // const displaySize = { width: video.width, height: video.height };
    // faceapi.matchDimensions(canvasDetections, displaySize);
    // const resizedDetections = faceapi.resizeResults(detections, displaySize);
    // canvasDetections.getContext("2d").clearRect(0, 0, canvasDetections.width, canvasDetections.height);
    // faceapi.draw.drawDetections(canvasDetections, resizedDetections);
    // console.log(resizedDetections);
    //COMMENT THESE NEXT TWO LINES OUT
    // faceapi.draw.drawFaceLandmarks(canvasDetections, resizedDetections);
    // faceapi.draw.drawFaceExpressions(canvasDetections, resizedDetections);

    //******************************************************* */

    if (detections[0]) {
      const { happy, sad, angry, surprised } = detections[0].expressions;
      const emotionNames = ["happy", "sad", "angry", "surprised"];
      // const { happy, angry, surprised } = detections[0].expressions;
      // const emotionNames = ["happy", "angry", "surprised"];
      const refObj = {
        happy: {
          name: "happy",
          data: happy,
          // display: document.getElementById("happyDisplay"),
          threshold: 0.99,
          bars: document.getElementById(`happyBars`),
        },

        sad: {
          name: "sad",
          data: sad,
          // display: document.getElementById("sadDisplay"),
          threshold: 0.95,
          bars: document.getElementById(`sadBars`),
        },

        angry: {
          name: "angry",
          data: angry,
          // display: document.getElementById("angryDisplay"),
          threshold: 0.95,
          bars: document.getElementById(`angryBars`),
        },

        surprised: {
          name: "surprised",
          data: surprised,
          // display: document.getElementById("surprisedDisplay"),
          threshold: 0.99,
          bars: document.getElementById(`surprisedBars`),
        },
      };

      emotionNames.forEach((emotion) => {
        //Keep the status bar of current emotion at full.
        if (currentEmotion === emotion) {
          refObj[emotion].bars = statusBarsRef[4];
        }

        //Keep updating the decimal that appears on the webpage, for each emotion.
        // refObj[emotion].display.innerText = `${emotion}: ${refObj[
        //   emotion
        // ].data.toFixed(2)}`;

        //Keep updating the status bars for each emotion.
        refObj[emotion].bars.innerText =
          statusBarsRef[emotionDuration[emotion]];

        //Change the emotion name to blue if you hit its decimal, and black when you lose it again.
        // refObj[emotion].data > refObj[emotion].threshold
        //   ? (refObj[emotion].display.style.color = "blue")
        //   : (refObj[emotion].display.style.color = "black");

        //Decrease the status bars whenever user stops showing this emotion.
        if (refObj[emotion].data < 0.9) {
          if (emotionDuration[emotion] > 0) {
            emotionDuration[emotion]--;
          }
        }

        //Should we take a new photo? Only if it will be different emotion to current photo.
        if (
          refObj[emotion].data > refObj[emotion].threshold &&
          currentEmotion !== emotion
        ) {
          //User has held this emotion for 2 seconds! Let's take a photo.
          if (emotionDuration[emotion] === 1) {
            //DEVELOPMENT ONLY, DURATION REQUIRED SHOULD BE 5
            currentEmotion = emotion;

            // takepicture(resizedDetections[0]);
            takepicture(detections[0]);

            emotionDuration[emotion] = 0;
            document.getElementById("youAre").innerText = `You are ${emotion}!`;
          } else {
            //User is holding the emotion, so start filling the status bars!
            currentEmotion = "";

            if (emotionDuration[emotion] < 5) {
              //This bit is just to make the happy bars take twice as long to fill up, cos happy is easy otherwise.
              if (emotion === "happy") {
                if (happyToggle) {
                  emotionDuration[emotion]++;
                }
                happyToggle = !happyToggle;
              }
              //All non-happy emotions are allowed to fill up their bars normally.
              else emotionDuration[emotion]++;
            }

            //Reset status bars of all other emotions to 0 whenever you start filling a certain emotion's bars.
            emotionNames.forEach((emotion2) => {
              if (emotion2 !== emotion) {
                emotionDuration[emotion2] = 0;
              }
            });
          }
        }
      });

      function takepicture(detect) {
        // const photo = document.getElementById("photo");
        var context = canvasPhoto.getContext("2d");
        context.canvas.width = detect.alignedRect._box._width;
        context.canvas.height = detect.alignedRect._box._height;

        let offset = 10;

        let sourceX = detect.alignedRect._box._x + offset;
        let sourceY = detect.alignedRect._box._y + offset;
        let sourceW = detect.alignedRect._box._width - offset * 2;
        let sourceH = detect.alignedRect._box._height - offset * 2;
        let drawX = 0;
        let drawY = 0;
        let drawW = canvasPhoto.width;
        let drawH = canvasPhoto.height;

        context.drawImage(
          video,
          sourceX,
          sourceY,
          sourceW,
          sourceH,
          drawX,
          drawY,
          drawW,
          drawH
        );

        var data = canvasPhoto.toDataURL("image/png");

        const id_canvasPhoto = document.getElementById("canvasPhoto");
        id_canvasPhoto.setAttribute("src", data);
        id_canvasPhoto.setAttribute("label", currentEmotion);
      }
    }
    //************************* */
  }, 350);
});

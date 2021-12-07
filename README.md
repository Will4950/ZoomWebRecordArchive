# ZoomWebRecordArchive
Zoom Webhook cloud recording archiver. 

This is a simple app that demonstrates how to use the Zoom recording.complete webhook to automatically download all cloud recordings.

All cloud recordings on the account will be saved to `<user email>/<Date>-<Meeting Topic>-<recording_type>-<uuid>.<ext>`

Example: `user@user.com/Dec_7_2021-My_Zoom_Meeting-shared_screen_with_speaker_view-BY+HV+xxTzWi2xx7QTYKBQ==.mp4`

# Getting Started

These instructions will get you a copy of the project up and running on your local machine.

**Prerequisites:**
* [Zoom account](https://zoom.us)
* [Zoom Marketplace Account](https://marketplace.zoom.us/docs/guides)
* [Node.js 16+](https://nodejs.org/)

## Setup app locally
Clone and install the app and it's dependencies.

```bash
git clone https://github.com/Will4950/ZoomWebRecordArchive
```

```bash
cd zoomwebrecordarchive && npm install 
```

### Setup dotenv 
Create a `.env` file.

```bash
touch .env
```

Copy the following into this file, which we'll add your own values to:

```bash
PORT=3000
VERIFICATION_TOKEN=
DIR=./downloads/
```

> NOTE: Adjust dir to the path of your choosing for downloaded files.

# Create a Webhook Only app on the Zoom App Marketplace

Sign in to the Zoom App Marketplace and [Create a Webhook Only app](https://marketplace.zoom.us/develop/create?source=devdocs). 

To create the app, we'll need to add some quick info.  Add in the following:
1. *App Name*
2. *Company Name*
3. *Developer Name*
4. *Developer Contact*

### Add [Event Subscriptions](https://marketplace.zoom.us/docs/guides/tools-resources/webhooks#event-subscriptions)

Click the button next to `Event Subscriptions` to enable subscriptions, then Click **+ Add new event subscription**.  Add in the following:
1. *Subscription Name*
2. *Event notification endpoint URL*

> NOTE: The endpoint URL must be accessible from the public internet.  For testing, it is possible to use a ngrok https forwarding url.  

With that info complete, click `Add Events`.  

In the Event Types window we want to enable all recordings have completed.  

Click `Recording`, then select `All Recordings have completed`.  

Click `Done` when finished.

Click `Save`. Click `Continue` and activate the app.

## Update verification token

On the `Feature` tab for your Webhook Only app, copy and paste the `Verification Token` to your `.env` file created earlier.  

Example: ```VERIFICATION_TOKEN=RrLCDdAUTAO4955kKZwH1g```.

# Start the app
```bash
npm start
```
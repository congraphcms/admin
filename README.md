## Synopsis

Congraph CMS Admin App

## Installation

Run
```
npm install
```

Copy and change `.env` file
```
cp .env.example .env
```
File should look something like this
```
APP_URL=localhost:8080
CG_URL=http://example.dev/
DEFAULT_LOCALE=1
NODE_ENV=dev
```

To start a dev server run
```
npm start
```

To build a production version, run
```
npm run build
```

## Docker

### Building an image

Before building an image change the `.env.production` file.
```
cp .env.example .env.production
```
File should look something like this
```
APP_URL=http://admin.example.com/
CG_URL=http://example.com/
DEFAULT_LOCALE=1
NODE_ENV=production
```

To build an image run
```
docker build -t congraph/node-admin .
```

__Avoid building an image on production server.__

Instead, save image to a file
```
# docker save -o <IMAGE PATH> <IMAGE NAME>
docker save -o congraph_node_admin_image.tar congraph/node-admin
```
Then copy your image to a new system with regular file transfer tools. After that you will have to load the image into docker:
```
docker load -i <path to image tar file>
```
To save image, transfer it and load it in the same step try:
```
docker save <IMAGE_NAME> | bzip2 | pv | \
     ssh user@host 'bunzip2 | docker load'
```

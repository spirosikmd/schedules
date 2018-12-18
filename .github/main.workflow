workflow "Build and deploy on push" {
  on = "push"
  resolves = ["GitHub Action for Heroku"]
}

action "GitHub Action for Heroku" {
  uses = "actions/heroku@6db8f1c"
  secrets = ["GOOGLE_AUTH_CLIENT_ID", "GOOGLE_AUTH_CLIENT_SECRET", "JWT_SECRET", "MONGO_URI"]
  env = {
    NODE_ENV = "production"
    TZ = "UTC"
  }
}

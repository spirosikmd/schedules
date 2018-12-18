workflow "Deploy to Heroku" {
  on = "push"
  resolves = "release"
}

action "login" {
  uses = "actions/heroku@master"
  args = "container:login"
  secrets = ["HEROKU_API_KEY", "GOOGLE_AUTH_CLIENT_ID", "GOOGLE_AUTH_CLIENT_SECRET", "JWT_SECRET", "MONGO_URI"]
  env = {
    NODE_ENV = "production"
    TZ = "UTC"
  }
}

action "push" {
  uses = "actions/heroku@master"
  needs = "login"
  args = "container:push -a calm-fortress-1234 web"
  secrets = ["HEROKU_API_KEY", "GOOGLE_AUTH_CLIENT_ID", "GOOGLE_AUTH_CLIENT_SECRET", "JWT_SECRET", "MONGO_URI"]
  env = {
    NODE_ENV = "production"
    TZ = "UTC"
  }
}

action "release" {
  uses = "actions/heroku@master"
  needs = "push"
  args = "container:release -a calm-fortress-1234 web"
  secrets = ["HEROKU_API_KEY", "GOOGLE_AUTH_CLIENT_ID", "GOOGLE_AUTH_CLIENT_SECRET", "JWT_SECRET", "MONGO_URI"]
  env = {
    NODE_ENV = "production"
    TZ = "UTC"
  }
}

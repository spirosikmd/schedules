workflow "Deploy" {
  on = "push"
  resolves = ["Login"]
}

action "Build Server" {
  uses = "borales/actions-yarn@master"
  args = "install:server"
}

action "Build Client" {
  uses = "borales/actions-yarn@master"
  args = "install:client"
}

action "Test Server" {
  needs = "Build Server"
  uses = "borales/actions-yarn@master"
  args = "test:server"
  env = {
    CI = "true"
  }
}

action "Test Client" {
  needs = "Build Client"
  uses = "borales/actions-yarn@master"
  args = "test:client"
  env = {
    CI = "true"
  }
}

action "Login" {
  needs = ["Test Server", "Test Client"]
  uses = "actions/heroku@master"
  args = "login"
  secrets = ["HEROKU_API_KEY"]
}

workflow "Deploy" {
  on = "push"
  resolves = ["Test Server", "Test Client"]
}

# Login
action "Login" {
  uses = "actions/heroku@master"
  args = "container:login"
  secrets = ["HEROKU_API_KEY"]
}

action "Build Server" {
  needs = "Login"
  uses = "borales/actions-yarn@master"
  args = "install:server"
  env = {
    CI = "true"
  }
}

action "Build Client" {
  needs = "Login"
  uses = "borales/actions-yarn@master"
  args = "install:client"
  env = {
    CI = "true"
  }
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

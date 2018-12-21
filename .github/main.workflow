workflow "Deploy" {
  on = "push"
  resolves = "Release"
}

action "Build Server" {
  uses = "borales/actions-yarn@master"
  args = "install:server"
  env = {
    CI = "true"
  }
}

action "Build Client" {
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

action "Master Branch Filter" {
  needs = ["Test Server", "Test Client"]
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Login" {
  needs = "Master Branch Filter"
  uses = "actions/heroku@master"
  args = "container:login"
  secrets = ["HEROKU_API_KEY"]
}

action "Push" {
  needs = "Login"
  uses = "actions/heroku@master"
  args = "container:push -a schedule-5j7wpm7zpq web"
  secrets = ["HEROKU_API_KEY"]
}

action "Release" {
  needs = "Push"
  uses = "actions/heroku@master"
  args = "container:release -a schedule-5j7wpm7zpq web"
  secrets = ["HEROKU_API_KEY"]
}

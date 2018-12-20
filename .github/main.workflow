workflow "Deploy" {
  on = "push"
  resolves = ["Test Client", "Test Server"]
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

workflow "Deploy to Heroku" {
  on = "push"
  resolves = ["Test"]
}

action "Build" {
  uses = "borales/actions-yarn@master"
}

action "Test" {
  needs = "Build"
  uses = "borales/actions-yarn@master"
  args = "test"
}

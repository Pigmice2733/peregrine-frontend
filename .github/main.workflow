workflow "New workflow" {
  on = "push"
  resolves = ["Setup Node.js for use with actions"]
}

action "Setup Node.js for use with actions" {
  uses = "actions/setup-node@78148dae5052c4942d5b0f92719061df122a3b1c"
}
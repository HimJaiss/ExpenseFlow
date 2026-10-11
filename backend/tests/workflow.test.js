// Manual smoke-test checklist; run against a local seeded MongoDB instance.
const checks = [
  "Employee login succeeds; wrong password returns 401",
  "Employee list endpoint only returns their own vouchers",
  "Employee cannot approve/reject a voucher",
  "Draft cannot be submitted without employee signature",
  "Draft can be edited/deleted only by its owner",
  "Director approval fails without signature",
  "Director rejection fails without a reason",
  "Accounts role can view but cannot mutate vouchers"
];
console.log("Workflow smoke tests to execute:", checks);

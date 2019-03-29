# svc-cust-value

Customer value via DynamoDB.

## Deployment

This service is run on lambda, with api gateway in front of it
We are using [up](https://up.docs.apex.sh/#introduction) as the abstraction for this

to deploy we can just run the following JOBS on jenkins

* [TEST](https://jenkins.luxgroup.com/job/release-test-svc-cust-value/)
s
* [UAT](https://jenkins.luxgroup.com/job/release-uat-svc-cust-value/)

* [PRODUCTION](https://jenkins.luxgroup.com/job/release-prod-svc-cust-value/)

## Logs

This service does not currently forward logs to logentries
Logs can be found by logging into the bex aws account and looking at the following log groups in cloudwatch

* [TEST](https://ap-southeast-2.console.aws.amazon.com/cloudwatch/home?region=ap-southeast-2#logStream:group=/aws/lambda/api-user-customer-value-test;streamFilter=typeLogStreamPrefix)

* [UAT](https://ap-southeast-2.console.aws.amazon.com/cloudwatch/home?region=ap-southeast-2#logStream:group=/aws/lambda/api-user-customer-value-uat;streamFilter=typeLogStreamPrefix)

* [PRODUCTION](https://ap-southeast-2.console.aws.amazon.com/cloudwatch/home?region=ap-southeast-2#logStream:group=/aws/lambda/api-user-customer-value-production;streamFilter=typeLogStreamPrefix)

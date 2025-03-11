## QA Assignment by – Renz Escalera

- This is the QA assignment submission for the Senior Test Engineer position. This test automation framework is built with Playwright and TypeScript. This framework covers the tests for both API and UI. Before executing the test framework, please read through the instructions on how to set it up and how to setup the environment variables in this README file.

## Identified Bugs and For Improvement

1. **UI - Able to proceed to purchase with empty cart**

- Problem: When cart is empty, user can still proceed to purchase
- Solution: Disable the Place Order button when cart is empty to prevent user from proceeding
- Screenshot: https://imgur.com/a/ChYbhXO,

2. **UI - Contact us form accepts an incorrect email format**

- Problem: Contact Email field accepts an email with incorrect format
- Solutions:
  - There should be an error message that tells the user to provide a correct email format
  - Contact Email field should turn red to inform the user for the error
  - Disabler Send message button to prevent user from proceeding
- Screenshot: https://imgur.com/a/HVI3g7Y

3. **API/POST - Status field: Unclear error message when "test" is used as input**

- Problem: The error message is "can't be blank", when there is actually an input but an invalid one. This does not tell clearly the exact error.
- Solution: The clear message should be "status should only be active or inactive"
- Screenshot: https://imgur.com/a/R8ujqfy

4. **API/POST - Name field: Inconsistency in data type of the input**

- Problem: As seen in the screenshot, the input's data type is number but in the response it is now turned as a string which can be identified by its double quotations.
- Solution: There should be a proper handling that protects data integrity, consistency, and accuracy.
- Screenshot: https://imgur.com/a/ek1zouw

4. **API/POST - Name field: Accepts special characters**

- Problem: "!@#$%^&" are the special characters used and should not be allowed to be used as an input in the name field as these are non standard in names. Additionally, this can raise potential security risks for SQL injection and XSS scripting.
- Solution: Api Response status should be 422 to handle invalid inputs.
- Screenshot: https://imgur.com/a/sjQT75R

5. **API/POST - Id field: Accepts an input**

- Problem: When creating a new user, with id included in the object. The endpoint accepts it as if it will be the id of the new user. But in the response, it returns the auto-generated id so you could see that the id from the request and the response are different.
- Solution: Add an error handling when id is included in the request to avoid confusion as well. it would be much clear that the id field is auto-generated from the backend and will avoid unnecessary confusion.
- Screenshot: https://imgur.com/a/045UZko

5. **API/POST - Gender field: Unclear error message when "test" is used as input**

- Problem: The problem is similar with number 3 as the error message is "can't be blank, can be male of female". The gender field is not blank or empty at all. It has an input which is "test"
- Solution: The clear message should be "gender should only be male or female"
- Screenshot: https://imgur.com/a/nRSneTP

6. **API/DELETE - No message when user is successfully deleted**

- Problem: The endpoint does not communicate if the delete operation were successful as it does not return any message in the response.
- Solution: Return a message that the user is successfully deleted to increase user-friendliness.
- Screenshot: https://imgur.com/a/VLboy7d

## Steps to setup and execute the test framework

1. Install Node.js (latest version from from nodejs.org)
2. Clone the repository using the command: `git clone https://github.com/renzescalera/renz-qa-assignment-quatt-senior-test-engineer.git`
3. Navigate to the project folder - Example: `cd C:\users\your-computer\renz-qa-assignment-quatt-senior-test-engineer`
4. Install dependencies using the command: `npm install`
   - After installation, use the command: `npm -v` this confirms successful installation
5. Install Playwright using the command: `npx playwright install`
6. Playwright can run now using the command: `npx playwright test`

## How to setup the environment variables

- Inside of the `.env` file in the root folder contains the necessary environment variables such as base url for API and UI and Authorization token
- API token is not currently setup. Please follow the steps below:

1. Visit this url: https://gorest.co.in/consumer/login
2. Login using your Github/Google/Microsoft account
3. Once logged in, copy the token
4. Then paste it in .env with this format `API_TOKEN=123sampleT0k3nTesttoken`

## Folder Structure

1.  **.github**: Contains the yml file for the github actions CI/CD pipelines
2.  **page-objects**: Contains the classes that helps the code maintainability and scalability.
3.  **tests**: Contains the spec files or test frameworks built with Playwright and TypeScript. The tests are categorize by api and ui as mentioned in the file names.
4.  **.env**: Contains the environment variable for the test to run

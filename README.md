\# LTU Moodle Prototype



A \*\*Next.js\*\* application used to create a Moodle-style prototype with navigation, tabs, and coding exercises.



---



\## Table of Contents



\* \[Overview](#overview)

\* \[Tech Stack](#tech-stack)

\* \[Prerequisites](#prerequisites)

\* \[Environment Setup](#environment-setup)

\* \[Create the Project](#create-the-project)

\* \[Git Setup](#git-setup)

\* \[Run the Development Server](#run-the-development-server)

\* \[Project Structure](#project-structure)

\* \[Available Scripts](#available-scripts)

\* \[Troubleshooting](#troubleshooting)

\* \[Contributing](#contributing)

\* \[License](#license)



---



\## Overview



This project is a \*\*Next.js\*\* application used to build a Moodle prototype, including:



\* Course-style \*\*navigation\*\*

\* \*\*Tabs\*\* for sections/modules

\* \*\*Coding exercises\*\* placeholders/components



Use this as a foundation to iterate on LMS features and UI flows.



---



\## Tech Stack



\* \*\*Framework:\*\* Next.js (App Router, Turbopack)

\* \*\*Language:\*\* JavaScript (no TypeScript)

\* \*\*Linting:\*\* ESLint

\* \*\*Styling:\*\* Your choice (Tailwind not enabled by default)



---



\## Prerequisites



\* \*\*Operating System:\*\* Windows 10/11

\* \*\*Node.js (LTS)\*\* and \*\*npm\*\*

\* \*\*Git\*\* (with SSH access to GitHub if using SSH URLs)



Verify your environment (example output shown):



```powershell

\# Open in Windows Command Prompt

Microsoft Windows \[Version 10.0.26100.4946]

(c) Microsoft Corporation. All rights reserved.



\# Check versions

C:\\Users\\User> node -v

v22.18.0



C:\\Users\\User> npm -v

10.9.3

```



---



\## Environment Setup



Follow these steps to set up the project environment:



1\. \*\*Install Node.js \& npm\*\*



&nbsp;  \* Download and install Node.js (LTS version) from \[https://nodejs.org](https://nodejs.org)



2\. \*\*(Optional) Install Git\*\*



&nbsp;  \* Download Git for Windows from \[https://git-scm.com/download/win](https://git-scm.com/download/win)

&nbsp;  \* During setup, enable \*\*Git Bash\*\* and \*\*OpenSSH\*\* components.



---



\## Create the Project



Create a new Next.js app using \*\*create-next-app\*\*:



```powershell

C:\\Users\\User> npx create-next-app@latest ltu-moodle-prototype

Need to install the following packages:

create-next-app@15.5.0

Ok to proceed?  y



√ Would you like to use TypeScript? ... No

√ Which linter would you like to use? » ESLint

√ Would you like to use Tailwind CSS? ... No

√ Would you like your code inside a `src/` directory? ... No

√ Would you like to use App Router? (recommended) ... Yes

√ Would you like to use Turbopack? (recommended) ... Yes

√ Would you like to customize the import alias (`@/\*` by default)? ... No



Creating a new Next.js app in C:\\\\Users\\\\User\\\\ltu-moodle-prototype.



Using npm.



Initializing project with template: app



Installing dependencies:

\- react

\- react-dom

\- next



Installing devDependencies:

\- eslint

\- eslint-config-next

\- @eslint/eslintrc



added 300 packages, and audited 301 packages in 3m



131 packages are looking for funding

run `npm fund` for details



found 0 vulnerabilities

Initialized a git repository.



Success! Created ltu-moodle-prototype at C:\\\\Users\\\\User\\\\ltu-moodle-prototype

```



> \*\*Note:\*\* If you choose Tailwind CSS later, follow the official Tailwi




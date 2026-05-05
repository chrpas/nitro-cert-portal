A project in TeamCity is using three build configurations:

- **Continuous build** -- Builds `develop` and PRs automatically, for verification
- **Continuous deployment** -- Builds `develop` in prerelease mode and publishes package to Octopus for automatic deployment to INTEGRATION.
- **Publish release** -- Builds on a _version tag_ and publishes package to Octopus. Deployment must then be manually triggered for either PREPROD or PROD.

There is a template project in TeamCity called **Nitro5 Template** which should be used as a basis when setting up your project.

## Step 1: Copy project</a>

Locate the **Nitro5 Template** project by clicking "Projects" -> "Nitro5 Template"

<details>
<summary>Click "Settings" in the upper right corner and then the 3 dots </summary>
<img width="199" height="109" alt="image" src="https://github.com/user-attachments/assets/faf3d80d-dc15-47b3-b3bf-7f1b97a6b6f4" />

</details>

<details>
<summary>Click the three dots -> "Copy project" in the upper right corner</summary>
<img width="428" height="216" alt="image" src="https://github.com/user-attachments/assets/489cb794-5764-4593-b398-86c86e197bdb" />

</details>

<details>
<summary>Enter the name of your project and press "Copy"</summary>

![image](https://github.com/avensia/nitro5/assets/63298385/6bf0d5b6-8a40-4d29-90a3-6be01d32ecc4)

</details>

## Step 2: Set repository name</a>

Go to Project Parameters of your new project by "Edit project" -> "Parameters"

<details>
<summary>Click edit on "github.repositoryname"</summary>

![image](https://github.com/avensia/nitro5/assets/63298385/b26fb69d-c5b3-490a-b2d5-a116767efe1c)

</details>
<details>
<summary>Enter the GitHub repository name in the "Value" field. Click "Save"</summary>

![image](https://github.com/avensia/nitro5/assets/63298385/f029d5bf-f052-42e5-bdf8-5ba946c0722f)

</details>

## Step 3: Activate build configurations</a>

All build configurations for the new project are paused as default. You can still run the build configurations by manually triggering a build but for the automatic triggering of new builds to occur, they need to be activated.

## Congratulations!

You are now done with the TeamCity setup for your project. You should now start comitting some code and see the wonder happen!
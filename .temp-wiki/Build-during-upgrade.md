## Clone existing Nitro5 project
Follow [Setting Up TeamCity](https://github.com/avensia/nitro5/wiki/Setting-up-TeamCity)

## Pause all build configurations
Pause all build configurations to avoid accidental deploys while configuring TeamCity and making sure the upgraded project builds and runs as intended. The paused builds can be activated when you feel comfortable doing so. You can still manually start builds.

## Edit VCS Roots
Edit Git repository url and default branch to the project specific for all VCS roots.
![image](https://github.com/avensia/nitro5/assets/63298385/2b8b8ff4-4bfe-4814-ba67-095de2c0b959)

## Reserve version range for nitro5
Decide together with the project team an unused version range that can be reserved for the nitro5 upgrade. For example versions starting with v5.X.X or v5.2.X. The version range decided should from now on only be used for the nitro5 upgrade.

This is needed to avoid both nitro classic and nitro5 `Publish release` build configuration picking up the new tag.

### Exclude version range in nitro classic build configuration
Edit the VCS root for `Publish release` build configuration in the old nitro classic project. Add `-:refs/tags/v5*` in `Branch specification`
![image](https://github.com/avensia/nitro5/assets/63298385/0aee0b64-058c-497b-8a3b-39bd74f54d38)

### Include version range in nitro5 build configuration
Edit the VCS root for `Publish release` build configuration in the new nitro5 project. 
![image](https://github.com/avensia/nitro5/assets/63298385/78552a2b-d8c9-487f-a143-5a0f6d8cb7c0)
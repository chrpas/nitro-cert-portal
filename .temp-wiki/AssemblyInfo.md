The purpose of **AssemblyInfo** is to provide metadata about the application/package, such as title, version number, description etc.

Without this information, it would be hard to verify that we have the correct version of a package installed.

For Nitro, the total metadata for an application/package is made up by a _manual part_ and an _automatic part_.

Summary:
* `AssemblyInfo.cs` should always exist and you can modify it manually.
* `SharedAsemblyInfo.cs` will be created by garn (using the path registered in `assemblyInfo.registerTasks()`). You should **not** create this file yourself and it it should **not** be committed to git.
* If there are multiple projects in one single package, they can use the same `SharedAssemblyInfo.cs` (see details below on how).

### The manual part
As part of the .NET project template, a file is created under `<project_folder>\Properties\AssemblyInfo.cs`, which contains the meta data for the project. In Nitro this file should contain the following assembly attributes.

The only thing we usually edit here is the name of our application/package, which we add twice (!).

```c#
using System.Reflection;

[assembly: AssemblyTitle("MyPackage")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyProduct("MyPackage")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("")]
```
⚠️ If we include any of the automatic attributes in the manual file, we will get a build error.

### The automatic part
Garn uses the version information from the git tag to create the automatic part of AssemblyInfo:

```c#
using System.Reflection;
using System.Runtime.InteropServices;
using System.Runtime.CompilerServices;
// Do not modify this file manually, use garn instead.

[assembly: AssemblyDescription("${version.sha1}")]
[assembly: AssemblyCompany("Avensia")]
[assembly: AssemblyCopyright("Copyright © Avensia")]
[assembly: ComVisible(false)]
[assembly: AssemblyVersion("${assemblyVersion}")]
[assembly: AssemblyFileVersion("${version.version}.${lastPart}")]
[assembly: AssemblyInformationalVersion("${format(version)}")]
```

The automatic part is created as part of the `package` task, which then calls `assemblyinfo:create` ([source](https://github.com/avensia/garn/blob/garn4/src/assembly-info.ts))

In order for garn to know where to place the file, we must provide this information in `buildsystem\index.ts`:

```typescript
import { assemblyInfo } from '@avensia/garn';
...
assemblyInfo.registerTasks({ <path-to-shared-assembly-info> });
```

By convention, we call this file `SharedAssemblyInfo.cs` but it could really be named anything. It will only be created on the build server and never persisted to git (unless we are in a multiple project scenario, see below).

For the `SharedAssemblyInfo.cs` to be part of the build we must set the path to below the project root (i.e. next to the csproj or further down).

> Note: SDK-style csprojs will automatically include certain extensions automatically from the project folder

During _production builds_, the manual file and the automatic file are then built and "merged" to represent the final AssemblyInfo for the package. For local builds, version will always be 0.0.0 (because the automatic file is not generated).

### Multiple projects in the same package
In case you have multiple projects that are part of a package, you might want to make sure each assembly has the same version as the package, e.g.

```console
<package>\src\<project1>
<package>\src\<project2>
```

To achieve the same versioning across the projects, we create a _placeholder SharedAssemblyInfo.cs_ and place it in the `src` root:

```console
<package>\src\<project1>
<package>\src\<project2>
<package>\src\SharedAssemblyInfo.cs
```

Now, since this file above project level, it will not automatically be included in the build. So we must make sure it is part of each csproj that are part of the package:

```xml
  <ItemGroup>
    <Compile Include="..\SharedAssemblyInfo.cs" />
  </ItemGroup>
```

In this scenario, `SharedAssemblyInfo.cs` needs to be version controlled, since otherwise the local build will fail - because of the explicit include. In the basic scenario (where we only had one project) we did not have to explicitly include the file, so it was never "missing" in local build.

And it's perfectly fine to have a zero-byte file as a placeholder - as long as it compiles! 

## The different version attributes

### AssemblyVersion

Example: `[assembly: AssemblyVersion("5.0.0.0")]`

This attribute is used internally by .NET and is not shown on the properties screen for an assembly (see screenshot below).

As per recommendation, garn deliberately sets this to the major version and strips out minor/patch (can be overriden).

### AssemblyFileVersion

Example: `[assembly: AssemblyFileVersion("5.6.1.0")]`

Corresponds to _File version_ on the properties screen for an assembly.

### AssemblyInformationalVersion

Example: `[assembly: AssemblyInformationalVersion("5.6.1")]`

Corresponds to _Product version_ on the properties screen for an assembly.

This attribute will reflect whether it is a prerelease build or not.

For more information, see https://stackoverflow.com/questions/64602/what-are-differences-between-assemblyversion-assemblyfileversion-and-assemblyin

![image](https://github.com/avensia/nitro5/assets/6929325/9045f08d-4122-41a8-82ef-cec837a5025f)
<br/>_Mapping of attributes to properties_

![image](https://github.com/avensia/nitro5/assets/6929325/5164b8ac-a433-4040-ac8f-118dad8b7e9d)
<br/>_Product version contains the prerelease info_


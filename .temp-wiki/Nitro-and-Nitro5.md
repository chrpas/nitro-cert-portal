In January 2022, just when Nitro had turned 5 years old, we started upgrading Nitro (which is .NET Framework 4.7.2) to .NET 5. Because of so many breaking changes between .NET Framework 4 and .NET 5, we decided to have two different Nitros, living in parallell, separated in different repositories. We usually refer to the original Nitro as "Nitro classic", while the new .NET 5 version of Nitro got the name of "Nitro5". 

Note that we've kept the name of "Nitro5" even though Nitro5 is now .NET 8 (while packages are .NET 6).

Please see the following introductory sections on Nitro classic onboarding, describing the idea and purpose of Nitro:

1. [Introduction to Nitro](https://github.com/avensia/nitro/blob/develop/docs/INTRODUCTION_TO_NITRO.md)
2. [Nitro development](https://github.com/avensia/nitro/blob/develop/docs/NITRO_DEVELOPMENT.md)
3. [Nitro - a headless SPA](https://github.com/avensia/nitro/blob/develop/docs/SINGLE_PAGE_APPLICATION.md) (although note that even though the general idea of Scope is still the same the implementation of it differs between Nitro classic and Nitro5)

For an overview of what has changed between Nitro classic and Nitro5, see [Changes in nitro5](https://github.com/avensia/nitro5/wiki/Changes-in-Nitro5).

## Repositories
* Nitro classic: [nitro](https://github.com/avensia/nitro) + [suite](https://github.com/avensia/suite) + [scope](https://github.com/avensia/scope)
* Nitro5: [nitro5](https://github.com/avensia/nitro5) + [nitro5-packages](https://github.com/avensia/nitro5-packages) (nitro5-packages includes scope) (plus [avensia-oss/tstypegen](https://github.com/avensia-oss/tstypegen) and [avensia/garn](https://github.com/avensia/garn))

## Optimizely
Nitro5 uses:
- **Optimizely CMS 12** 
   - ...formerly known as **Episerver CMS**
- **Optimizely Commerce Connect 14** 
   - ...formerly known as **Optimizely Customized Commerce**
   - ...formerly known as **Optimizely Commerce**
   - ...formerly known as **Episerver Commerce** 
   - ...which was acquired by Episerver from **Mediachase Commerce**

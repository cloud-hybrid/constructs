# `cloud-iac` Infrastructure as ***"Constructs"***  #

> Constructs are classes which define a “piece of system state”. Constructs can be composed together to form higher-level building blocks which represent more complex state. 
> 
> Constructs are often used to represent the desired state of cloud applications. For example, in the AWS CDK, which is used to define the desired state for AWS infrastructure
> using CloudFormation, the lowest-level construct represents a resource definition in a CloudFormation template. These resources are composed to represent higher-level logical units of a cloud application, etc.
> 

`cloud-iac` aims to define a set of *custom constructs* -- both L1 & L2 -- in efforts towards
security, re-usability, and overall cloud-provider defined best-practices.

Additionally, custom constructs abstract configuration; 
rather than learning new interfaces (classes), abstraction eases
the ability to create a deployable.

## Usage ##

### Default ###

```bash
npx --yes cloud-iac@latest
```

### Interactive ###

```bash
npx --yes cloud-iac@latest --interactive
```

### Debug ###

```bash
npx --yes cloud-iac@latest --debug
```

### All CLI Flags ###

```bash
npx --yes cloud-iac@latest --interactive --debug
```

## Default IaC Directory ##

Simply, update the `package.json`'s `config` setting:

```json
{
    "name": "example",
    ...
    "config": {
        "iac": "[Default-IaC-Directory]"
    }
}
```

The output directory defaults to `ci`;


## References ##

- [Community CDKTF Modules](https://github.com/Pocket/terraform-modules)
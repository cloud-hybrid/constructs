# `cloud-iac` Infrastructure as ***"Constructs"***  #

> *Constructs are classes which define a “piece of system state”. Constructs can be composed
> together to form higher-level building blocks which represent more complex state. Constructs
> are often used to represent the desired state of cloud applications. For example, in the AWS
> CDK, which is used to define the desired state for AWS infrastructure using CloudFormation,
> the lowest-level construct represents a resource definition in a CloudFormation template.
> These resources are composed to represent higher-level logical units of a cloud application,
> etc.*

`cloud-iac` aims to define a set of *custom constructs* -- both L1 & L2 -- in efforts towards
security, re-usability, and overall cloud-provider defined best-practices.

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

---

## Task Board ##

- [ ] Examine https://github.com/Chan9390/aws-mfa-enforce
- [ ] Examine Pattern https://github.com/serverless/examples/tree/master/aws-node-env-variables
- [ ] Examine https://github.com/serverless/examples/tree/master/aws-node-github-webhook-listener
- [ ] [Implement Custom Authorizer](https://github.com/serverlessbuch/jwtAuthorizr)
- [ ] Test Database via Pattern:
    - [ ] https://github.com/serverless/examples/tree/master/aws-node-mongodb-atlas
    - [x] https://github.com/serverless/examples/tree/v2/aws-node-http-api-mongodb
        - Eventually Creating POC  
- [ ] Examine https://github.com/SCPR/pfs-email-serverless/blob/master/handler.js
- [x] Examine https://github.com/Pocket/terraform-modules/tree/main/src/pocket
- [ ] Examine https://github.com/aws-samples/aws-lambda-sample-applications
- [x] Examine https://github.com/hashicorp/docker-on-aws-ecs-with-terraform-cdk-using-typescript
- [ ] Examine https://github.com/hashicorp/cdktf-repository-manager
- [ ] [Setup S3 Remote State](https://github.com/hashicorp/terraform-cdk/blob/main/examples/typescript/backends/s3/main.ts)
- [ ] Create a AWS Profile Switcher, displaying the currently set profile to use similar to that of `.venv`
- [x] **Extend** `@cloud-hybrid/delta`'s `api` Package to include:
    - [CDK ECS Fargate Service w/Local Image](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/ecs/fargate-service-with-local-image)
- [x] **Test Web-Socket(s)** via `ws` & Development-Dependency `wscat`
- [ ] **Integrate Remote State**
     ```node
     // S3 Backend - https://www.terraform.io/docs/backends/types/s3.html
     new S3Backend(this, {
        bucket: "mybucket",
        key: "path/to/my/key",
        region: "us-east-1",
     });
   
     // S3 Remote State
     const otherState = new DataTerraformRemoteStateS3(this, "other", {
        bucket: "myotherbucket",
        key: "path/to/my/key",
     });
   
     // Reference Remote State
     new s3.DataAwsS3BucketObject(this, "object", {
        bucket: "objectbucket",
        key: otherState.get("bucket_key"),
     });
     ```
---

## Usage ##

There exists a few different ways to run `cloud-factory`, depending on the context.

- [**Development Usage**](#development-usage)
- [**NPX Global Usage**](#npx-global-usage)
- [**NPM System Usage**](#npm-system-usage)

#### Development Usage ####

While locally developing, the application can be started via the `start` command located in `package.json`:

```bash
# Start
npm run start

# Help
npm run start -- --help

# Environment Sub-Command Example
npm run start -- environment
```

**Note**: a `--` is required between the `run-script` command, and CLI input. This is due to limitations around
`npm`, and parsing input.

### NPX Global Usage ###

`npx` runs against the most recently-published `NPM` package.

```bash
# Start
npx --yes cloud-factory@latest

# Help
npx --yes cloud-factory@latest ? [--] --help

# Environment Sub-Command Example
npx --yes cloud-factory@latest ? [--] environment
```

**Note**: the `--yes` flag is only required to bypass the `install` prompt. Once installed, the `--yes` flag can be
optionally included without prompt.

### NPM System Usage ###

`cloud-factory` can optionally be installed globally to any `npm`-capable system.

First, run `npm install --global cloud-factory`. Then, `cloud-factory` can be used similar to any other installed
executable:

```bash
# Installation
npm install --global cloud-factory@latest
```

```bash
# Start
cloud-factory

# Help
cloud-factory --help

# Environment Sub-Command Example
cloud-factory environment
```

## Example(s) - A Lambda Deployment ##

*The following example deploys a __single__ Lambda function*, but includes, implicitly, the following resources:

- Lambda Function
- A Lambda Layer
- API Gateway
- X-Ray Enablement
- Log-Groups
- SSM Parameter(s)

**Note**, the only requirement would be a Lambda Function, but for the sake of demonstration, the example includes a
Lambda **Layer**, too.

***All other resources are defined dynamically by `cloud-factory`.***

1. Define and create a new directory
    - `mkdir -p example`
    - `cd example`
2. Clone source(s)
    1. **Lambda Function**
        - `git clone https://github.com/cloud-hybrid/lambda-function-concept.git ./test-function`
    2. **Lambda Layer**
        - `git clone https://github.com/cloud-hybrid/lambda-layer-concept.git ./library/test-layer`
3. *Define a `factory.json` file*:
    ```json
    {
        "name": "Concept",
        "organization": "Cloud-Vault",
        "environment": "Development"
    }
    ```
    - i.e.
    ```bash
    cat << "EOF" > factory.json
    {
        "name": "Concept",
        "organization": "Cloud-Vault",
        "environment": "Development"
    }
    EOF
    ```
4. Ensure the current directory takes the following shape:
   ```
   example
     ├── factory.json
     ├── test-function
     └── library
         └── test-layer
   ```
5. With the current-working-directory set to `example`, run:
   ```bash
   npx --yes cloud-factory@latest ci-cd initialize --debug
   ```
    - Feel free to omit the `--debug` flag. It's only included for verbosity and understanding
6. Verify that a `distribution` folder was created.
7. Synthesize the state + source code:
   ```
   npx --yes cloud-factory@latest ci-cd synthesize --debug
   ```
8. Deploy the lambda function + layer:
    ```
    npx --yes cloud-factory@latest ci-cd deploy --debug
    ```
9. A hyperlink will be provided upon successful completion. With reference to the example, navigating
   to `https://v41dkt0ik0.execute-api.us-east-2.amazonaws.com/development/test-function` will then provide a JSON
   response body containing information about the package, and the lambda function's layer.

**Synopsis**

```bash
mkdir -p example && cd "${_}"

git clone https://github.com/cloud-hybrid/lambda-function-concept.git ./test-function

git clone https://github.com/cloud-hybrid/lambda-layer-concept.git ./library/test-layer

cat << "EOF" > factory.json
{
    "name": "Concept",
    "organization": "Cloud-Vault",
    "environment": "Development"
}
EOF

npx --yes cloud-factory@latest --version

npx cloud-factory ci-cd initialize  --debug
npx cloud-factory ci-cd synthesize  --debug
npx cloud-factory ci-cd deploy      --debug

[[ "${?}" == "0" ]] && echo "Successfully Deployed"
```

## Design Philosophy ##

The design philosophies and motivations behind `cloud-factory` are simple:

- Eliminate drift between deployable(s) across environments
- Create an agnostic interface to generate and deploy distribution(s)
- Configure opinionated defaults with zero impact on development teams

### Overview ###

At a high level, `cloud-factory` receives a set of repositories as **input**, executes **directory translations** and
potentially compile(s) code, and **outputs** a *distribution*. The distribution is composed of an opinionated structure
that later fulfills deployment requirements. Through analysis of repository layout(s) & dependencies, a series of
constructs, or cloud resources, are dynamically composed into a singular stack -- the stack becomes the deployable.

When lower level constructs -- **repositories** -- become capable of implicitly defining infrastructure-related
requirements, a large portion of development overhead and maintenance can be eliminated.

### Opinionated Defaults ###

An ***opinionated default*** can be any additional or non-default attribute that assists defining a cloud resource. For
example, in Azure, GCP, and AWS, resources can have *Tags*. Through key-value assignment, a subset of resources can all
be attributed an **Environment** *key* with a `Development`
value.

While seemingly of little value, parsers or API scrappers can use these tags to filter through applicable resources.
Billing, security auditing, and patch-groups are all but some benefits administrators can gain from assigning
tag-related opinionated defaults.

### Packaging Structure ###

With the following example structure:

```
.
├── factory.json
│
├── library
│    └── shared-resource-1
│        ├── LICENSE
│        ├── README.md
│        ├── package.json
│        └── src
│            └── index.js
│
├── cloud-resource-1
│    ├── LICENSE
│    ├── README.md
│    ├── package.json
│    └── src
│        └── index.js
│
└── cloud-resource-2
     ├── LICENSE
     ├── README.md
     ├── package.json
     └── src
          └── index.js
```

`cloud-factory` takes note of the following directories:

```
.
├── factory.json
├── library
│    └── shared-resource-1
├── cloud-resource-1
└── cloud-resource-2
```

However, also take note that the following example's `cloud-resource-2` is *no different* compared to the first example:

```
.
├── ...
├── arbitrary-folder-name
│    └──cloud-resource-2
│        ├── LICENSE
│        ├── README.md
│        ├── package.json
│        └── src
│            └── index.js
```

`cloud-factory` will transform the `cloud-resource-2` directory using the same translations in both examples when the
distribution gets compiled:

```
.
├── cloud-resource-1
│    ├── LICENSE
│    ├── README.md
│    ├── package.json
│    └── src
│         └── index.js
│
├── arbitrary-folder-name
│    └── cloud-resource-2
│         ├── LICENSE
│         ├── README.md
│         ├── package.json
│         └── src
│              └── index.js
│
└── distribution
     ├── cloud-resource-1
     │    └── ...
     └── cloud-resource-2
          └── ...
```

The freedom of repository-based folder structuring is just one of the abstractions `cloud-factory` will perform --
therefore limiting deployment and vcs requirements, or otherwise development-related overhead.

Regardless of any automated or otherwise pipeline'd implementation (deployments can also be performed locally), the
design pattern is always the same:

- *Clone in a remote repository to an arbitrary ci environment*

Programmatic logic can then be easily abstracted according to repository-to-directory mapping(s).

## References ##

- [Community CDKTF Modules](https://github.com/Pocket/terraform-modules)

- [AWS Regional Services](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/?p=ngi&loc=4)

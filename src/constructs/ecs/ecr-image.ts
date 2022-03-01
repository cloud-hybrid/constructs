import { TerraformAsset }                              from "cdktf";
import { Construct }                                   from "constructs";
import { Resource }                                    from "@cdktf/provider-null/lib/resource";
import { DataAwsEcrAuthorizationToken, EcrRepository } from "@cdktf/provider-aws/lib/ecr";

import FS      from "fs";
import Path    from "path";
import Process from "process";

const Serializer = ( file: string ) => JSON.parse( FS.readFileSync( file, { encoding: "utf-8" } ) );

class Image extends Resource {
    tag: string;
    version: string;
    image: Resource;

    constructor( scope: Construct, name: string, projectPath: string ) {
        super( scope, name );
        const repo = new EcrRepository( this, "ecr", { name } );

        const auth = new DataAwsEcrAuthorizationToken( this, "authorization", {
            dependsOn: [ repo ],
            registryId: repo.registryId
        } );

        const asset = new TerraformAsset( this, "project", {
            path: projectPath
        } );

        this.version = Serializer( Path.join( Process.cwd(), "package.json" ) )?.version ?? "latest";

        this.tag = repo.repositoryUrl + ":" + this.version + "-" + asset.assetHash;

        // Workaround due to https://github.com/kreuzwerker/terraform-provider-docker/issues/189
        this.image = new Resource( this, "image", {} );

        this.image.addOverride(
            "provisioner.local-exec.command", [
                ["docker login -u", auth.userName].join(" "),
                ["docker build -t", this.tag, asset.path].join(" "),
                ["docker push", this.tag].join(" ")
            ].join(" && ")
        );
    }
}

export { Image };

export default Image;
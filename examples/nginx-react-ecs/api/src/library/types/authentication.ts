/***
 * See RFC 7617, base64-encoded credentials. More information below
 */

interface Basic {
    name: "Basic";
}

/***
 * See RFC 6750, bearer tokens to access OAuth 2.0-protected resources
 */

interface Bearer {
    name: "Bearer";
}

/***
 * See RFC 7616. Firefox 93 and later support SHA-256 encryption. Previous versions only support MD5 hashing (not recommended).
 */

interface Digest {
    name: "Digest";
}

/***
 * See RFC 7486, Section 3, HTTP Origin-Bound Authentication, digital-signature-based
 */

interface HOBA {
    name: "HOBA";
}

/***
 * See RFC 8120
 */

interface Mutual {
    name: "Mutual";
}

/***
 * See RFC4599
 */

interface NTLM {
    name: "NTLM";
}

/***
 * See RFC 8292
 */

interface VAPID {
    name: "VAPID";
}

/***
 * See RFC 7804
 */

interface SCRAM {
    name: "SCRAM";
}

/***
 * See AWS docs. AWS4-HMAC-SHA256. This scheme is used for AWS3 server authentication.
 */

interface AWS4 {
    name: "AWS4-HMAC-SHA256";
}

type Methods = keyof Authentication;
interface Authentication {
    Basic: Basic;
    Bearer: Bearer;
    Digest: Digest;
    HOBA: HOBA;
    Mutual: Mutual;
    NTLM: NTLM;
    VAPID: VAPID;
    SCRAM: SCRAM;
    AWS4: AWS4;

    Methods: Methods;
}

enum Schemes {
    Basic = "Basic",
    Bearer = "Bearer",
    Digest = "Digest",
    HOBA = "HOBA",
    Mutual = "Mutual",
    NTLM = "NTLM",
    VAPID = "VAPID",
    SCRAM = "SCRAM",
    AWS4 = "AWS4",
    Methods = "Methods"
}

export { Schemes };
export type { Authentication };


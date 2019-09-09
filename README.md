neutron
=======

## Introduction

`neutron` is a web extension on Firefox. It's designed to enhance the security
when using ProtonMail via web interface.

ProtonMail is known to be safe in the way that even the company itself does not
know your private key (precisely, the password of it). The private key is used
for communication and decryption of most online features(like emails stored
in an account), and is the most critical part for one's own security.

Not likely happening but theoretically possible however, could exist an attack
where the server at ProtonMail may serve a malicious javascript file and
intercept your password right after typed into the password box. That way, both
the password and the private key is compromised. Either ProtonMail itself, or
someone hacking into the server, or a malicious https connection enabling
man-in-the-middle attack, could do this.

### Feature 1: freeze the scripts in use

This paranoid scenario might be mitigated, when we freeze all the scripts from
ProtonMail server locally. When loading a new script, instead of doing that
online, we use our local version. If a new and unknown script is requested to
be loaded, simply block it. That way, if the existing scripts are
backdoor-free, then we are safe even if the server becomes evil.

### Feature 2: preserve the oldschool CSP

Using Firefox's `webRequest` API, we could also freeze the
Content-Security-Policy set by the server. As we have only frozen all
separately served scripts, it's necessary to preserve the correct CSP in order
to avoid malicious inline-scripts within webpage.

### Feature 3: check HTTPS certificates in use

The HTTPS connection is also checked for man-in-the-middle attacks. Only
whitelisted certifcates may be used. When an unknown certifcate appears in use,
the connection is blocked.

Although Firefox will detect most MitM attacks, it's possible that a malicious
CA, as might be controlled by states, issue a certificate that won't raise
invalid certificate errors. Another possibility is a user-imported root
certificate, allowing devices to monitor network activity. Since we are
paranoid, we will freeze a known certificate chain and trust only the known few
certificates used by ProtonMail.

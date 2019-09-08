neutron
=======

`neutron` is a web extension on Firefox. It's designed to enhance the security
when using ProtonMail via web interface.

To achieve this, `neutron` intercepts and forces the web interface to use
with given javascripts preloaded within extensions. These fixed scripts from
a given (trusted) version, elimates the possibilty, such as the ProtonMail
server send a modified script containing backdoor and revealing user password
to the server or anywhere else.

The HTTPS connection is also checked for man-in-the-middle attacks. Only
whitelisted certifcates may be used. When an unknown certifcate appears
in use, the connection is blocked.



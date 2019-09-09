#!/usr/bin/env python3

files = """
# 2019-09-09
/vendor2Lazy.module.175b42e10a.chunk.js
/vendors~vendor2Lazy.module.75828ba4e6.chunk.js
/vendor2Lazy.module.91de42d067.chunk.js
/vendors~vendor2Lazy.module.1df3e5d1be.chunk.js
"""

files = files.split("\n")
for each in files:
    if each and not each.startswith("#"):
        print("wget https://mail.protonmail.com%s" % each)

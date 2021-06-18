# olojs-next
This library contains a collection of experimental extension of [olojs]. In 
particular, it contains the following packages:

*   `browser-store` is an olojs Store backed by the browser storage
*   `ipfs-store` is a read-only olojs Store that uses [ipfs] as backend
*   `standard-router` is an olojs Router defining a standard directory strucure 
*   `sub-store` is a function that, given a store `s` and a path `p`, returns a
    subordinate olojs Store of `s` where paths `/path` ponts to `/p/path`
*   `olo-atom` is an [atom] plugin that features olojs documents syntax
    highlighting


[olojs]: https://github.com/onlabsorg/olojs
[ipfs]: https://ipfs.io/
[atom]: https://atom.io/

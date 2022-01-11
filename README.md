# pvr-server

A very simple node server to serve the PVR (person visit registration) tool.

It's basically a proxy that redirects to either the pvr-client (another node application) or the api (currently restheart, which is a server that exposes mongodb as a rest service).

The entire application could be replaced with nginx, but it might still be useful for development.

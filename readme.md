# Genji

Genji is the simple intranet portal. It serves as a landing page for your network segment allowing easily configured YAML sections with links to your resources and notes for your staff.

## Features

* Easy YAML configuration, no code / html experience needed.
* Links are displayed along with their destination and a redirect link so that you can have easy to remember addresses for common resources.
* Config file can be edited through the web interface allowing for page maintenance without needing access to the server.
* Built as a docker container app so it is easy to set up and easy to maintain.
* Notes in the page allow you to convey important notices, give directions on how the network is to be used, or just add some color and clarity.

## Installation

## Config Syntax

### Root Properties

#### name
```yaml
name: Test Intranet Site Name
```
The name will be displayed in the top navigation bar of your site.

#### version
```yaml
version: 1.0.0
```
Version info will be displayed in the top right of the navigation bar, this allows you to easily version your page (I recommend keeping it in some kind of version control so you don't lose revisions and details that you might want back later) and keep track of which version is live at any given time.

#### alerts
An optional array of alert object definitions that will be displayed at the top of the site each time it is loaded. These are particularly useful for organization wide alerts that everyone needs to be reminded of. They are dismissible, but their dismissed state is lost on each page reload.

#### sites:
A required array of site object definitions that comprise the main content of the site. Sites are a generic grouping that can be used to break up your content into categories, physical locations, departments or whatever logical divisions make the most sense for your page.

### Object Definitions

#### alert
An alert is a general warning or message that applies to the entire page and not a particular site or division within it. They are dismissible and have the following syntax.
```yaml
alerts:
  - title: Alert title goes here
    type: primary
    content: Alert text and html content goes here.
```
* `title:` is required and sets a larger text heading for the alert
* `type:` is optional and can be any of the types listed below, or if left off will default to `warning`.
* `content:` is mandatory and can either be plain text, or if you want to include html it must be single quoted `'`

#### site
A site is a logical grouping of related links and notes. All links are generated both as clickable links for the page, and also as url forward destinations to help facilitate easy site naming for your internal business pages and has the following syntax.
```yaml
sites:
  - name: General
    type: success
    links:
      - name: Test link 1
        path: /test1
        destination: http://www.google.com
      - name: Test link 2
        path: /test2
        destination: http://www.amazon.com
    notes:
      - name: A note!
        type: danger
        content: This is a dangerous note!
```
* `name:` is required for each site and sets the name of the site in it's top bar
* `type:` is optional for each site, sets the background color of the header for the site, and defaults to `primary` if not set.
* `links:` is a collection of link objects that each define a link for the page. All links must have a `name:`, a `path:`, and a `destination:` that together define their behavior and will be used to build the link and it's description for the page.
* `notes:` is a collection of optional site notes that will display in the page. All notes must contain a `name:` and `content:`, with an optional `type:` that will set a color for the note.

## Sample
```yaml
name: Sample Site!
version: 1.0.0
alerts:
  - title: This is a successful alert!
    type: success
    content: Look at how successful this alert is!
sites:
  - name: First Site
    type: primary
    links:
      - name: First Site - First Link
        path: /first1
        destination: http://www.google.com
      - name: First Site - Second Link
        path: /first2
        destination: http://192.168.1.10:8080/login
    notes:
      - name: A note that warns you!
        type: warning
        content: 'This note comes with a <s>strong</s> warning'
  - name: Second Site
    type: Secondary
    links:
      - name: Second Site - First Link
        path: /second1
        destination: http://www.google.com
      - name: Second Site - Second Link
        path: /second2
        destination: http://192.168.1.10:8080/login
    notes:
      - name: A note that informs you!
        type: info
        content: This note is a little bland, but informative
```

## Type List
Where types are allowed they can be one of the following list; `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `dark`, `light`.

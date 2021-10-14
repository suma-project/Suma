# Quickstart

## Installation

Please see the [installation docs](installation.md).

## Admin Tools

### Location trees

<video controls style="width: 100%; max-width:500px; height:auto">
  <source src="/Suma/movies/location_movie.mp4" type="video/mp4">
  <source src="/Suma/movies/location_movie.webm" type="video/webm">
</video>

* Location trees are reusable across multiple initiatives.
* Be sure to create at least one location in each location tree.

#### Navigate to the location editor

* Starting from the administrative dashboard (e.g. http://YOUR_HOST/sumaserver/admin),
  click on the "Edit locations" link.

#### Create a location tree

* Click "Create new location tree" link to create a location tree.
* Enter a unique name and a description for the location tree.

#### Select a location tree

* Using the drop-down near the top of the page, select an existing
  location tree (such as the one you just created).
* Click "Display Locations."

#### Create and name locations

* Click "Add a location" once for each new location you would like to create.
* On each location, click the "Edit" link to assign a name and description
  to a location, as well as to enable or disable an existing location.

> **Note:** New locations and changes to existing locations will not be saved
until the "Save Locations" link is clicked.

#### Reorder locations

* Click and hold on a location or location branch and drag it up and down
  to reorder the location tree.

#### Nest locations

* Click and hold on a location or location branch and drag it right and
  left to nest it under another location.

#### Disable locations

* Click the "Edit" link on a location and uncheck the "Enabled"
  option to disable a location.

> **Note:** In order to prevent data loss, locations can not be deleted.
Disabling a location will suppress it in the data collection client.

#### Save the location tree

* Save your changes by clicking the "Save Locations" link at the bottom of the page.

### Initiatives and activities

<video controls style="width: 100%; max-width:500px; height:auto">
  <source src="/Suma/movies/activities_movie.mp4" type="video/mp4">
  <source src="/Suma/movies/activities_movie.webm" type="video/webm">
</video>

#### Navigate to the initiative editor

* Starting from the administrative dashboard (e.g. http://YOUR_HOST/sumaserver/admin),
  click on the "Edit initiatives" link.

#### Create an initiative

* Click the "Create new initiative" and enter a unique name and a description.
* Select an existing location tree for this initiative.

> **Note:** Every initiative must be associated with a location tree,
and the selected location tree can not be changed later.
More than one initiative can share the same location tree.

#### Select an initiative

* Using the drop-down near the top of the page, select an existing
  initiative (such as the one you just created).
* Click "Display Initiative."

#### Add some activity groups

* Click "Add Activity Group" to create a new activity group with a single activity.
* Click "Edit" on the activity group to set the name, description, and other settings.

> Activity groups can be set to be required for data collection and can also specify
whether member activities can be selected for the same count.

#### Add some activities

* Click "Add Activity" on an activity group
* Click "Edit" on this new activity to set a title and description
  or to disable this activity.

#### Reorder activities and activity groups

* Click and drag an activity or an activity group to reorder them or to
  move activities between activity groups.

#### Disable an activity

* Click "Edit" on an activity to enable or disable this activity.

#### Save the initiative

* Click "Save Activities" to save any changes to the initiative's activities. None
  of these changes will take effect until they are saved.

#### Enable the initiative

* Click "Enable Initiative" to enable data collection using this new initiative.

## Collecting Data (Client)

<video controls style="width: 100%; max-width:500px; height:auto">
  <source src="/Suma/movies/client_movie.mp4" type="video/mp4">
  <source src="/Suma/movies/client_movie.webm" type="video/webm">
</video>

### Start a collecting session

* Open the Suma client in a mobile or desktop browser

### Select an initiative

* Under "Select a collection program" in the left sidebar, select one of
  your initiatives.

### Select a location

* Select a location for which to collect data in the sidebar.

> **Note:** data can only be collected for a terminal location
(one without any child locations).

### Select any relevant activities

* If this initiative contains activities, select any activities that
  apply to this specific count.

### Count!

* Hit the large "Count" button to record a single count with the location
  and activities you selected. The time will be recorded automatically.

> Should you need to remove a count or an entire session before you finish
collecting, there are buttons to support this in the header.

### Finish counting

* Click "Finish Collecting" to complete the session and attempt to send
  the data to the server.

> **Note:** All data will be retained in the browser until it is successfully
sent to the server. This data should be retained even after restarting the browser,
or closing the browser without finishing the collection. The client will
attempt to send the data to the server each time you reload the Suma client or
finish collecting.

Office.onReady(() => {
  // If needed, Office.js is ready to be called.
});

/**
 * Shows a notification when the add-in command is executed.
 * @param event {Office.AddinCommands.Event}
 */
function action(event) {
  // Indicate when the add-in command function is complete.
  event.completed();
}

Office.actions.associate("action", action);

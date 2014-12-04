<div class="st-block__dropzone">
  <span class="st-icon">
    <%= _.result(block, "icon_name") %>
  </span>
  <p>
    <%= i18n.t("general:drop", { block: "<span>" + _.result(block, "title") + "</span>" }) %>
  </p>
</div>

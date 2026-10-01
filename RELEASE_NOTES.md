# 1.6.0 RC8

Final-candidate changes from 1.5:

- removed font refresh/import workflow
- removed fonts.json / fonts.js dependency
- added fixed local/system font presets
- added Liberation Sans and Liberation Mono
- changed default page/clock font to Liberation Sans
- no remote font services
- retained zero-fetch-on-Save Unsplash behavior
- retained manual wallpaper cooldown and cross-tab cache lock
- replaced default quote list with original project text
- release defaults contain no private Unsplash configuration


RC2:
- settings changed from centered modal to fixed left-side drawer
- removed full-page dim/blur while settings are open
- live page preview stays visible beside settings on desktop widths
- startpage content re-centers in remaining viewport space
- settings footer is sticky for easier Save/Cancel access


RC3:
- quicklinks editor changed from stacked unlabeled inputs to separate cards
- each quicklink now shows explicit Name and URL labels
- each collection now shows a separate labeled card
- remove actions are now clearer with [remove] buttons in each card header


RC4:
- added Custom… to page-font and clock-font dropdowns
- custom font field appears only when Custom… is selected
- accepts a local family name or full CSS font stack
- custom fonts preview live while typing
- older saved custom font stacks are automatically mapped into Custom…


RC5:
- extension now ships with zero quotes
- added Quotes section to Settings
- quotes can be added, edited, and removed as separate cards
- saved quotes are stored locally with the rest of the startpage settings
- empty quote list hides the quote area completely
- saving a new quote list updates the startpage immediately
- README includes two optional copy-paste example quotes


RC6:
- added Firefox data_collection_permissions required for new AMO submissions
- requires Firefox 140+
- declares searchTerms for the built-in search feature
- declares authenticationInfo as optional for the Unsplash Access Key
- saving an Unsplash key now requests Firefox's built-in optional data consent
- Unsplash requests refuse to transmit the key if that permission is absent


RC7:
- added search engine selection to Settings
- built-in DuckDuckGo, Google, Brave Search, Startpage, Kagi, and Bing presets
- added Custom... search URL support using `%s` as the query placeholder
- selected search engine is stored locally
- search submission now uses the saved setting instead of a fixed config value


RC8:
- saving an Unsplash key is local-only and no longer opens Firefox's permission prompt
- added clear privacy text beside the key field
- added separate [enable Unsplash] action for optional authenticationInfo consent
- wallpaper requests remain blocked until the user explicitly enables Unsplash

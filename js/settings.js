/**
 *
 * (c) Copyright Ascensio System Limited 2010-2018
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html).
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@converter.com
 *
 * The interactive user interfaces in modified source and object code versions of converter must display
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 § 3(b) of the GNU GPL you must retain the original converter logo which contains
 * relevant author attributions when distributing the software. If the display of the logo in its graphic
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by converter"
 * in every copy of the program you distribute.
 * Pursuant to Section 7 § 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
 */

(function ($, OC) {

    $(document).ready(function () {
        OCA.converter = _.extend({}, OCA.converter);
        if (!OCA.converter.AppName) {
            OCA.converter = {
                AppName: "converter"
            };
        }

        var advToogle = function () {
            $("#converterSecretPanel, #converterSaveBreak").toggleClass("converter-hide");
        };

        if ($("#converterInternalUrl").val().length
            || $("#converterSecret").val().length
            || $("#converterStorageUrl").val().length) {
            advToogle();
        }

        $("#converterAdv").click(function () {
            advToogle();
        });

        $("#converterSave").click(function () {
            $(".section-converter").addClass("icon-loading");
            var converterUrl = $("#converterUrl").val().trim();

            if (!converterUrl.length) {
                $("#converterInternalUrl, #converterStorageUrl, #converterSecret").val("");
            }

            var converterInternalUrl = ($("#converterInternalUrl:visible").val() || "").trim();
            var converterStorageUrl = ($("#converterStorageUrl:visible").val() || "").trim();
            var converterSecret = $("#converterSecret:visible").val() || "";

            var defFormats = {};
            $("input[id^=\"converterDefFormat\"]").each(function() {
                defFormats[this.name] = this.checked;
            });

            var sameTab = $("#converterSameTab").is(":checked");

            $.ajax({
                method: "PUT",
                url: OC.generateUrl("apps/converter/ajax/settings"),
                data: {
                    documentserver: converterUrl,
                    documentserverInternal: converterInternalUrl,
                    storageUrl: converterStorageUrl,
                    secret: converterSecret,
                    defFormats: defFormats,
                    sameTab: sameTab
                },
                success: function onSuccess(response) {
                    $(".section-converter").removeClass("icon-loading");
                    if (response && response.documentserver != null) {
                        $("#converterUrl").val(response.documentserver);
                        $("#converterInternalUrl").val(response.documentserverInternal);
                        $("#converterStorageUrl").val(response.storageUrl);
                        $("#converterSecret").val(response.secret);

                        var message =
                            response.error
                                ? (t(OCA.converter.AppName, "Error when trying to connect") + " (" + response.error + ")")
                                : t(OCA.converter.AppName, "Settings have been successfully updated");
                        var row = OC.Notification.show(message);
                        setTimeout(function () {
                            OC.Notification.hide(row);
                        }, 3000);
                    }
                }
            });
        });

        $(".section-converter input").keypress(function (e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
                $("#converterSave").click();
            }
        });
    });

})(jQuery, OC);

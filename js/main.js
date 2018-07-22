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

(function (OCA) {

    OCA.converter = _.extend({}, OCA.converter);
    if (!OCA.converter.AppName) {
        OCA.converter = {
            AppName: "converter"
        };
    }

    OCA.converter.setting = {};

    OCA.converter.CreateFile = function (name, fileList) {
        var dir = fileList.getCurrentDirectory();

        if (!OCA.converter.setting.sameTab) {
            var winEditor = window.open("");
            if (winEditor) {
                winEditor.document.write(t(OCA.converter.AppName, "Loading, please wait."));
                winEditor.document.close();
            }
        }

        $.post(OC.generateUrl("apps/" + OCA.converter.AppName + "/ajax/new"),
            {
                name: name,
                dir: dir
            },
            function onSuccess(response) {
                if (response.error) {
                    if (winEditor) {
                        winEditor.close();
                    }
                    var row = OC.Notification.show(response.error);
                    setTimeout(function () {
                        OC.Notification.hide(row);
                    }, 3000);
                    return;
                }

                fileList.add(response, { animate: true });
                OCA.converter.OpenEditor(response.id, winEditor);

                var row = OC.Notification.show(t(OCA.converter.AppName, "File created"));
                setTimeout(function () {
                    OC.Notification.hide(row);
                }, 3000);
            }
        );
    };

   OCA.converter.OpenEditor = function (fileId, winEditor) {
        var url = OC.generateUrl("/apps/" + OCA.converter.AppName + "/{fileId}",
            {
                fileId: fileId
            });

        if ($("#isPublic").val()) {
            url += "?token=" + encodeURIComponent($("#sharingToken").val());
        }

        if (winEditor && winEditor.location) {
            winEditor.location.href = url;
        } else if (!OCA.converter.setting.sameTab) {
            winEditor = window.open(url, "_blank");
        } else {
            location.href = url;
        }
    };

    OCA.converter.FileClick = function (fileName, context, attr) {
        var fileInfoModel = context.fileInfoModel || context.fileList.getModelForFile(fileName);
        var fileList = context.fileList;
        if (!attr.conv || (fileList.dirInfo.permissions & OC.PERMISSION_CREATE) !== OC.PERMISSION_CREATE || $("#isPublic").val()) {
            OCA.converter.OpenEditor(fileInfoModel.id);
            return;
        }

		OC.dialogs.confirm(t(OCA.converter.AppName, "The document file you open will be converted to the Office Open XML format for faster viewing and editing."),
            t(OCA.converter.AppName, "Convert and open document"),
            function (convert) {
                if (!convert) {
                    OCA.converter.OpenEditor(fileInfoModel.id);
                    return;
                }

                $.post(OC.generateUrl("apps/" + OCA.converter.AppName + "/ajax/convert"),
                    {
                        fileId: fileInfoModel.id
                    },
                    function onSuccess(response) {
                        if (response.error) {
                            var row = OC.Notification.show(response.error);
                            setTimeout(function () {
                                OC.Notification.hide(row);
                            }, 3000);
                            return;
                        }

                        if (response.parentId == fileList.dirInfo.id) {
                            fileList.add(response, { animate: true });
                        }

                        var row = OC.Notification.show(t(OCA.converter.AppName, "File created"));
                        setTimeout(function () {
                            OC.Notification.hide(row);
                        }, 3000);
                    });
            });
    };

    OCA.converter.GetSettings = function (callbackSettings) {
        if (OCA.converter.setting.formats) {

            callbackSettings();

        } else {

            $.get(OC.generateUrl("apps/" + OCA.converter.AppName + "/ajax/settings"),
                function onSuccess(settings) {
                    OCA.converter.setting = settings;

                    callbackSettings();
                }
            );

        }
    };

    OCA.converter.FileList = {
        attach: function (fileList) {
            if (fileList.id == "trashbin") {
                return;
            }

            var register = function() {
                var mimes = OCA.converter.setting.formats;

                $.each(mimes, function (ext, attr) {
                    fileList.fileActions.registerAction({
                        name: "converterOpen",
                        displayName: t(OCA.converter.AppName, "Open in converter"),
                        mime: attr.mime,
                        permissions: OC.PERMISSION_READ,
                        icon: function () {
                            return OC.imagePath(OCA.converter.AppName, "app-dark");
                        },
                        actionHandler: function (fileName, context) {
                            OCA.converter.FileClick(fileName, context, attr);
                        }
                    });

                    if (attr.def1) {
                        fileList.fileActions.setDefault(attr.mime, "converterOpen");
                    }
                });
            }

            OCA.converter.GetSettings(register);
        }
    };


	/**OCA.converter.NewFileMenu = {
        attach: function (menu) {
            var fileList = menu.fileList;

            if (fileList.id !== "files") {
                return;
            }

            menu.addMenuEntry({
                id: "converterDocx",
                displayName: t(OCA.converter.AppName, "Document"),
                templateName: t(OCA.converter.AppName, "Document"),
                iconClass: "icon-converter-new-docx",
                fileType: "docx",
                actionHandler: function (name) {
                    OCA.converter.CreateFile(name + ".docx", fileList);
                }
            });

            menu.addMenuEntry({
                id: "converterXlsx",
                displayName: t(OCA.converter.AppName, "Spreadsheet"),
                templateName: t(OCA.converter.AppName, "Spreadsheet"),
                iconClass: "icon-converter-new-xlsx",
                fileType: "xlsx",
                actionHandler: function (name) {
                    OCA.converter.CreateFile(name + ".xlsx", fileList);
                }
            });

            menu.addMenuEntry({
                id: "converterPpts",
                displayName: t(OCA.converter.AppName, "Presentation"),
                templateName: t(OCA.converter.AppName, "Presentation"),
                iconClass: "icon-converter-new-pptx",
                fileType: "pptx",
                actionHandler: function (name) {
                    OCA.converter.CreateFile(name + ".pptx", fileList);
                }
            });
        }
    };*/

    var initPage = function(){
        if ($("#isPublic").val() && !$("#dir").val().length) {
            var fileName = $("#filename").val();
            var extension = fileName.substr(fileName.lastIndexOf(".") + 1);

            var initSharedButton = function() {
                var mimes = OCA.converter.setting.formats;

                var conf = mimes[extension];
                if (conf) {
                    var button = document.createElement("a");
                    button.href = OC.generateUrl("apps/" + OCA.converter.AppName + "/s/" + encodeURIComponent($("#sharingToken").val()));
                    button.className = "button";
                    button.innerText = t(OCA.converter.AppName, "Open in converter")

                    if (!OCA.converter.setting.sameTab) {
                        button.target = "_blank";
                    }

                    $("#preview").append(button);
                }
            };

            OCA.converter.GetSettings(initSharedButton);
        } 
		else {
            OC.Plugins.register("OCA.Files.FileList", OCA.converter.FileList);
            /**OC.Plugins.register("OCA.Files.NewFileMenu", OCA.converter.NewFileMenu);*/
        }
    };

    $(document).ready(initPage)

})(OCA);


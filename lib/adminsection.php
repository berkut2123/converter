<?php
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

namespace OCA\converter;

use OCP\IURLGenerator;
use OCP\Settings\IIconSection;

/**
 * Settings section for the administration page
 */
class AdminSection implements IIconSection {

    /** @var IURLGenerator */
    private $urlGenerator;

    /**
     * @param IURLGenerator $urlGenerator - url generator service
     */
    public function __construct(IURLGenerator $urlGenerator) {
        $this->urlGenerator = $urlGenerator;
    }


    /**
     * Path to an 16*16 icons
     *
     * @return strings
     */
    public function getIcon() {
        return $this->urlGenerator->imagePath("converter", "app-dark.svg");
    }

    /**
     * ID of the section
     *
     * @returns string
     */
    public function getID() {
        return "converter";
    }

    /**
     * Name of the section
     *
     * @return string
     */
    public function getName() {
        return "converter";
    }

    /**
     * Get priority order
     *
     * @return int
     */
    public function getPriority() {
        return 50;
    }
}

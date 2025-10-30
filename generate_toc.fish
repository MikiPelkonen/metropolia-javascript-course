#!/usr/bin/env fish

set README "README.md"

# Start the README with a header
echo "# metropolia-javascript-course" >$README
echo ----- >>$README
echo "## Table of Contents" >>$README
echo "" >>$README

for module in */
    if test $module = node_modules/
        continue
    end

    set module_name (string replace -r '/$' '' $module)
    set module_anchor (string replace " " "-" (string lower $module_name))
    echo "- [$module_name](#$module_anchor)" >>$README

    for sub in $module*/
        if test $sub = "$module""node_modules/"
            continue
        end

        set sub_name (string replace -r '/$' '' $sub)
        set sub_name (string split "/" $sub_name)[-1]
        set sub_anchor (string replace " " "-" (string lower "$module_name-$sub_name"))
        echo "  - [$sub_name](#$sub_anchor)" >>$README
    end
end

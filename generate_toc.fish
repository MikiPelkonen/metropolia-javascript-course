#!/usr/bin/env fish

set README "README.md"

echo "# metropolia-javascript-course" >$README
echo ----- >>$README
echo "## 📖 Table of Contents" >>$README
echo "" >>$README

for module in */
    if test $module = node_modules/
        continue
    end

    set module_name (string replace -r '/$' '' $module)
    echo "- [$module_name](./$module_name/)" >>$README

    for sub in $module*/
        if test $sub = "$module""node_modules/"
            continue
        end

        set sub_name (string replace -r '/$' '' $sub)
        set sub_name_last (string split "/" $sub_name)[-1]
        echo "  - [$sub_name_last](./$sub_name/)" >>$README
    end
end

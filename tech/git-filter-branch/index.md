# 批量修改 git 仓库提交人信息


> 仅限在可控状态下使用，否则会被别人打死。

批量修改 git 仓库提交人信息

```bash
#!/bin/sh

git filter-branch --env-filter '
    an="$GIT_AUTHOR_NAME"
    am="$GIT_AUTHOR_EMAIL"
    cn="$GIT_COMMITTER_NAME"
    cm="$GIT_COMMITTER_EMAIL"

    if [ "$GIT_COMMITTER_EMAIL" = "<old_user>@gmail.com" ]
    then
        cn="<new_user>"
        cm="<new_user>@gmail.com"
    fi

    if [ "$GIT_AUTHOR_EMAIL" = "<old_user>@outlook.com" ]
    then
        an="<new_user>"
        am="<new_user>@gmail.com"
    fi

    export GIT_AUTHOR_NAME="$an"
    export GIT_AUTHOR_EMAIL="$am"
    export GIT_COMMITTER_NAME="$cn"
    export GIT_COMMITTER_EMAIL="$cm"
'
```

修改完以后 `git push --force`。


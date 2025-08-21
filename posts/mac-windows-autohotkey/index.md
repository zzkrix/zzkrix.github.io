# 虚拟机中使用 Mac 快捷键


Mac 上使用虚拟机安装了 Windows，若想正常使用`cmd + c`、`cmd + v`等快捷键，按以下步骤操作。

安装 [AutoHotkey](https://www.autohotkey.com/)，这里选择下载 v1 版本，因为下面的脚本只支持 v1。

![2024-06-24-09-56-zgZaVp](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-06-24-09-56-zgZaVp.png)

从 GitHub 上下载一个脚本[https://github.com/stroebjo/autohotkey-windows-mac-keyboard](https://github.com/stroebjo/autohotkey-windows-mac-keyboard)。

把里面的`MacKeyboard.ahk`这个文件下载下来。

用编辑器打开`MacKeyboard.ahk`文件，可以看到里面实际上是做了一些映射。

```bash
;-----------------------------------------
; Mac keyboard to Windows Key Mappings
;=========================================

; --------------------------------------------------------------
; NOTES
; --------------------------------------------------------------
; ! = ALT
; ^ = CTRL
; + = SHIFT
; # = WIN
;
; Debug action snippet: MsgBox You pressed Control-A while Notepad is active.

#InstallKeybdHook
#SingleInstance force
SetTitleMatchMode 2
SendMode Input

; --------------------------------------------------------------
; Mac-like screenshots in Windows (requires Windows 10 Snip & Sketch)
; --------------------------------------------------------------

; Capture entire screen with CMD/WIN + SHIFT + 3
#+3::send #{PrintScreen}

; Capture portion of the screen with CMD/WIN + SHIFT + 4
#+4::#+s

; --------------------------------------------------------------
; media/function keys all mapped to the right option key
; --------------------------------------------------------------

RAlt & F7::SendInput {Media_Prev}
RAlt & F8::SendInput {Media_Play_Pause}
RAlt & F9::SendInput {Media_Next}
F10::SendInput {Volume_Mute}
F11::SendInput {Volume_Down}
F12::SendInput {Volume_Up}

; swap left command/windows key with left alt
;LWin::LAlt
;LAlt::LWin ; add a semicolon in front of this line if you want to disable the windows key

; Remap Windows + Left OR Right to enable previous or next web page
; Use only if swapping left command/windows key with left alt
;Lwin & Left::Send, !{Left}
;Lwin & Right::Send, !{Right}

; Eject Key
;F20::SendInput {Insert} ; F20 doesn't show up on AHK anymore, see #3

; F13-15, standard windows mapping
F13::SendInput {PrintScreen}
F14::SendInput {ScrollLock}
F15::SendInput {Pause}

;F16-19 custom app launchers, see http://www.autohotkey.com/docs/Tutorial.htm for usage info
F16::Run http://twitter.com
F17::Run http://tumblr.com
F18::Run http://www.reddit.com
F19::Run https://facebook.com

; --------------------------------------------------------------
; OS X system shortcuts
; --------------------------------------------------------------

; Make Ctrl + S work with cmd (windows) key
#s::Send, ^s

; Selecting
#a::Send, ^a

; Copying
#c::Send, ^c

; Pasting
#v::Send, ^v

; Cutting
#x::Send, ^x

; Opening
#o::Send ^o

; Finding
#f::Send ^f

; Undo
#z::Send ^z

; Redo
#y::Send ^y

; New tab
#t::Send ^t

; close tab
#w::Send ^w

; Close windows (cmd + q to Alt + F4)
#q::Send !{F4}

; Remap Windows + Tab to Alt + Tab.
Lwin & Tab::AltTab

; minimize windows
#m::WinMinimize,a

; --------------------------------------------------------------
; OS X keyboard mappings for special chars
; --------------------------------------------------------------

; Map Alt + L to @
!l::SendInput {@}

; Map Alt + N to \
+!7::SendInput {\}

; Map Alt + N to ©
!g::SendInput {©}

; Map Alt + o to ø
!o::SendInput {ø}

; Map Alt + 5 to [
!5::SendInput {[}

; Map Alt + 6 to ]
!6::SendInput {]}

; Map Alt + E to €
!e::SendInput {€}

; Map Alt + - to –
!-::SendInput {–}

; Map Alt + 8 to {
!8::SendInput {{}

; Map Alt + 9 to }
!9::SendInput {}}

; Map Alt + - to ±
!+::SendInput {±}

; Map Alt + R to ®
!r::SendInput {®}

; Map Alt + N to |
!7::SendInput {|}

; Map Alt + W to ∑
!w::SendInput {∑}

; Map Alt + N to ~
!n::SendInput {~}

; Map Alt + 3 to #
!3::SendInput {#}



; --------------------------------------------------------------
; Custom mappings for special chars
; --------------------------------------------------------------

;#ö::SendInput {[}
;#ä::SendInput {]}

;^ö::SendInput {{}
;^ä::SendInput {}}


; --------------------------------------------------------------
; Application specific
; --------------------------------------------------------------

; Google Chrome
#IfWinActive, ahk_class Chrome_WidgetWin_1

; Show Web Developer Tools with cmd + alt + i
#!i::Send {F12}

; Show source code with cmd + alt + u
#!u::Send ^u

#IfWinActive
```

`;` 开头的表示注释。

`+` 表示 `SHIFT` 键

`#` 表示 `win` 键

`!` 表示 `ALT` 键

`^` 表示 `CTRL` 键

所以 `#1::Send ^1` 表示将 `win + 1` 或者 `cmd + 1` 快捷键映射成 `ctrl + 1`。

这里我增加了以下内容，用于多标签页窗口（chrome、文件浏览器等）中使用 `cmd + 数字`切换标签。

```bash
; select tab
#1::Send ^1
#2::Send ^2
#3::Send ^3
#4::Send ^4
#5::Send ^5
#6::Send ^6
#7::Send ^7
#8::Send ^8
#9::Send ^9
```

这里有一个比较奇怪的问题，如果上面的第一行 `; select tab` 换成了中文注释 `; 选择标签页`，上述配置就会失效，除非第一行和第二行中间加一个空行，原因不明，保险起见用英文写注释内容吧。

然后，windows 里快捷键 `win + r`，输入 `shell:startup`，回车后会打开开机启动文件夹。

将上面的`MacKeyboard.ahk`文件拖到打开的文件夹里，重启电脑即可。

![2024-06-24-10-03-G9bHyM](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-06-24-10-03-G9bHyM.png)


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/mac-windows-autohotkey/  


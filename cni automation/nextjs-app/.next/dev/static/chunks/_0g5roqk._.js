(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerClient",
    ()=>ComposerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$workspaces$2f5b$workspaceId$5d2f$composer$2f$PlatformPreview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$workspaces$2f5b$workspaceId$5d2f$composer$2f$data$3a$2aef2c__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/workspaces/[workspaceId]/composer/data:2aef2c [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$workspaces$2f5b$workspaceId$5d2f$composer$2f$data$3a$e6df49__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/workspaces/[workspaceId]/composer/data:e6df49 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$post$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schemas/post.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hash.mjs [app-client] (ecmascript) <export default as Hash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/type.mjs [app-client] (ecmascript) <export default as Type>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-upload.mjs [app-client] (ecmascript) <export default as UploadCloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.mjs [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.mjs [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-ccw.mjs [app-client] (ecmascript) <export default as RefreshCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.mjs [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const SUCCESS_LABELS = {
    scheduled: 'Post scheduled successfully',
    pending_approval: 'Sent for approval',
    draft: 'Draft saved'
};
const SUCCESS_BADGE_CLASS = {
    scheduled: 'badge-published',
    pending_approval: 'badge-pending',
    draft: 'badge-draft'
};
function successHeadline({ status, accountCount }) {
    const label = SUCCESS_LABELS[status] || `Post saved with status "${status.replace(/_/g, ' ')}"`;
    return `${label} — ${accountCount} account${accountCount === 1 ? '' : 's'}`;
}
function ComposerClient({ workspace, accounts, brandKit }) {
    _s();
    const [selectedAccounts, setSelectedAccounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isPerPlatform, setIsPerPlatform] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sharedCaption, setSharedCaption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [platformCaptions, setPlatformCaptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [mediaUrls, setMediaUrls] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isUploading, setIsUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadProgress, setUploadProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [scheduledAt, setScheduledAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [serverError, setServerError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [successInfo, setSuccessInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [bannedWordWarn, setBannedWordWarn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activePreviewTab, setActivePreviewTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const leftPaneRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Set default preview tab when selection changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComposerClient.useEffect": ()=>{
            if (selectedAccounts.length > 0 && !selectedAccounts.includes(activePreviewTab || '')) {
                setActivePreviewTab(selectedAccounts[0]);
            } else if (selectedAccounts.length === 0) {
                setActivePreviewTab(null);
            }
        }
    }["ComposerClient.useEffect"], [
        selectedAccounts,
        activePreviewTab
    ]);
    // Debounced banned words check
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComposerClient.useEffect": ()=>{
            const checkWords = {
                "ComposerClient.useEffect.checkWords": ()=>{
                    if (!brandKit?.banned_words || brandKit.banned_words.length === 0) return;
                    const allText = [
                        sharedCaption,
                        ...Object.values(platformCaptions)
                    ].join(' ').toLowerCase();
                    const hasBannedWord = brandKit.banned_words.some({
                        "ComposerClient.useEffect.checkWords.hasBannedWord": (word)=>allText.includes(word.toLowerCase())
                    }["ComposerClient.useEffect.checkWords.hasBannedWord"]);
                    setBannedWordWarn(hasBannedWord);
                }
            }["ComposerClient.useEffect.checkWords"];
            const timeout = setTimeout(checkWords, 500);
            return ({
                "ComposerClient.useEffect": ()=>clearTimeout(timeout)
            })["ComposerClient.useEffect"];
        }
    }["ComposerClient.useEffect"], [
        sharedCaption,
        platformCaptions,
        brandKit
    ]);
    const handleAccountToggle = (accountId)=>{
        setSelectedAccounts((prev)=>prev.includes(accountId) ? prev.filter((id)=>id !== accountId) : [
                ...prev,
                accountId
            ]);
    };
    const insertText = (text)=>{
        // A simplified insert - for real app, we'd use ref and selectionStart
        if (!isPerPlatform) {
            setSharedCaption((prev)=>prev + ' ' + text);
        } else {
            if (activePreviewTab) {
                setPlatformCaptions((prev)=>({
                        ...prev,
                        [activePreviewTab]: (prev[activePreviewTab] || '') + ' ' + text
                    }));
            }
        }
    };
    const handleUpload = async (e)=>{
        if (!e.target.files || e.target.files.length === 0) return;
        setIsUploading(true);
        setUploadProgress(10);
        setServerError('');
        try {
            const newUrls = [
                ...mediaUrls
            ];
            // We process files sequentially for simplicity in this implementation
            for(let i = 0; i < e.target.files.length; i++){
                const file = e.target.files[i];
                const { signedUrl, publicUrl } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$workspaces$2f5b$workspaceId$5d2f$composer$2f$data$3a$e6df49__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getUploadSignedUrl"])(workspace.id, file.name, file.type);
                await fetch(signedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type
                    }
                });
                newUrls.push(publicUrl);
                setUploadProgress(10 + Math.floor(80 * ((i + 1) / e.target.files.length)));
            }
            setMediaUrls(newUrls);
        } catch (err) {
            setServerError('Failed to upload media. Please try again.');
        } finally{
            setIsUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };
    const removeMedia = (index)=>{
        setMediaUrls((prev)=>prev.filter((_, i)=>i !== index));
    };
    const resetForm = ()=>{
        setSelectedAccounts([]);
        setIsPerPlatform(false);
        setSharedCaption('');
        setPlatformCaptions({});
        setMediaUrls([]);
        setScheduledAt('');
        setErrors({});
        setServerError('');
        setBannedWordWarn(false);
        setActivePreviewTab(null);
    };
    const handleSubmit = async (isDraft)=>{
        setIsSubmitting(true);
        setErrors({});
        setServerError('');
        setSuccessInfo(null);
        // Prepare captions dictionary
        const captions = {};
        for (const id of selectedAccounts){
            captions[id] = isPerPlatform ? platformCaptions[id] : sharedCaption;
        }
        const accountTargets = selectedAccounts.map((id)=>{
            const acc = accounts.find((a)=>a.id === id);
            return {
                id,
                platform: acc.platform,
                name: acc.account_name
            };
        });
        let scheduledDate = null;
        if (scheduledAt) {
            scheduledDate = new Date(scheduledAt).toISOString();
        }
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$workspaces$2f5b$workspaceId$5d2f$composer$2f$data$3a$2aef2c__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["submitPost"])({
                accounts: accountTargets,
                captions,
                mediaUrls,
                scheduledAt: scheduledDate
            }, workspace.id, isDraft, workspace.requires_approval);
            if (result.success) {
                setSuccessInfo({
                    status: result.status || 'saved',
                    scheduledAt: scheduledDate,
                    accountCount: accountTargets.length
                });
                // Stay on the composer: clear the form so the next post can be written right away.
                resetForm();
                leftPaneRef.current?.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                if (result.errors) setErrors(result.errors);
                if (result.serverError) setServerError(result.serverError);
            }
        } catch (e) {
            setServerError('An unexpected error occurred.');
        } finally{
            setIsSubmitting(false);
        }
    };
    // Group accounts by platform
    const fbAccounts = accounts.filter((a)=>a.platform === 'facebook');
    const igAccounts = accounts.filter((a)=>a.platform === 'instagram');
    const isInstagramSelected = selectedAccounts.some((id)=>accounts.find((a)=>a.id === id)?.platform === 'instagram');
    // Compute timezone min for schedule (primitive approach)
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localIso = new Date(Date.now() - tzOffset).toISOString().slice(0, 16);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "composer-page-layout page-content-wrapper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "composer-left-pane",
                ref: leftPaneRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "page-main-title",
                        children: "Create Post"
                    }, void 0, false, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    serverError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "brand-warn-banner",
                        style: {
                            backgroundColor: '#fef2f2',
                            borderColor: '#fca5a5',
                            color: '#991b1b'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this),
                            " ",
                            serverError
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this),
                    successInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "composer-success-banner",
                        role: "status",
                        style: {
                            alignItems: 'flex-start'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                size: 18,
                                style: {
                                    flexShrink: 0,
                                    marginTop: '1px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 235,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: successHeadline(successInfo)
                                    }, void 0, false, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 237,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: '8px',
                                            fontSize: '12px',
                                            fontWeight: 400,
                                            color: 'var(--text-muted)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `status-badge ${SUCCESS_BADGE_CLASS[successInfo.status] || 'badge-draft'}`,
                                                children: successInfo.status.replace(/_/g, ' ')
                                            }, void 0, false, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 239,
                                                columnNumber: 17
                                            }, this),
                                            successInfo.scheduledAt ? `Scheduled for ${new Date(successInfo.scheduledAt).toLocaleString()}` : 'No publish time set'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 238,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 236,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSuccessInfo(null),
                                "aria-label": "Dismiss confirmation",
                                style: {
                                    marginLeft: 'auto',
                                    background: 'none',
                                    border: 'none',
                                    color: 'inherit',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: 600
                                },
                                children: "Dismiss"
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 247,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                        lineNumber: 234,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "composer-section-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "section-label",
                                children: "Target Accounts"
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 259,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gap: '20px',
                                    gridTemplateColumns: '1fr 1fr'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    marginBottom: '12px',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    color: 'var(--text-muted)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            width: 16,
                                                            height: 16,
                                                            display: 'inline-flex'
                                                        },
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["icons"].facebook
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                        lineNumber: 265,
                                                        columnNumber: 17
                                                    }, this),
                                                    " Facebook"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 264,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '10px'
                                                },
                                                children: fbAccounts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '13px',
                                                        color: 'var(--text-muted)',
                                                        padding: '12px',
                                                        border: '1px dashed var(--border-card)',
                                                        borderRadius: '12px',
                                                        textAlign: 'center',
                                                        backgroundColor: '#f8fafc'
                                                    },
                                                    children: "Not connected"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                    lineNumber: 269,
                                                    columnNumber: 19
                                                }, this) : fbAccounts.map((acc)=>{
                                                    const isDisabled = acc.status !== 'active';
                                                    const isSelected = selectedAccounts.includes(acc.id);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: `account-chip ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                className: "account-chip-checkbox",
                                                                checked: isSelected,
                                                                onChange: ()=>handleAccountToggle(acc.id),
                                                                disabled: isDisabled
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                                lineNumber: 278,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '14px',
                                                                    color: 'var(--text-main)',
                                                                    fontWeight: 600,
                                                                    flex: 1
                                                                },
                                                                children: acc.account_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                                lineNumber: 285,
                                                                columnNumber: 25
                                                            }, this),
                                                            isDisabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: `/workspaces/${workspace.id}/accounts`,
                                                                style: {
                                                                    fontSize: '12px',
                                                                    color: '#ea580c',
                                                                    pointerEvents: 'auto',
                                                                    fontWeight: 600,
                                                                    textDecoration: 'none'
                                                                },
                                                                children: "⚠ Reconnect"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                                lineNumber: 287,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, acc.id, true, {
                                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                        lineNumber: 277,
                                                        columnNumber: 23
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 267,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 263,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    marginBottom: '12px',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    color: 'var(--text-muted)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            width: 16,
                                                            height: 16,
                                                            display: 'inline-flex'
                                                        },
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["icons"].instagram
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                        lineNumber: 301,
                                                        columnNumber: 17
                                                    }, this),
                                                    " Instagram"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 300,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '10px'
                                                },
                                                children: igAccounts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '13px',
                                                        color: 'var(--text-muted)',
                                                        padding: '12px',
                                                        border: '1px dashed var(--border-card)',
                                                        borderRadius: '12px',
                                                        textAlign: 'center',
                                                        backgroundColor: '#f8fafc'
                                                    },
                                                    children: "Not connected"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 19
                                                }, this) : igAccounts.map((acc)=>{
                                                    const isDisabled = acc.status !== 'active';
                                                    const isSelected = selectedAccounts.includes(acc.id);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: `account-chip ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                className: "account-chip-checkbox",
                                                                checked: isSelected,
                                                                onChange: ()=>handleAccountToggle(acc.id),
                                                                disabled: isDisabled
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                                lineNumber: 314,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '14px',
                                                                    color: 'var(--text-main)',
                                                                    fontWeight: 600,
                                                                    flex: 1
                                                                },
                                                                children: acc.account_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                                lineNumber: 321,
                                                                columnNumber: 25
                                                            }, this),
                                                            isDisabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: `/workspaces/${workspace.id}/accounts`,
                                                                style: {
                                                                    fontSize: '12px',
                                                                    color: '#ea580c',
                                                                    pointerEvents: 'auto',
                                                                    fontWeight: 600,
                                                                    textDecoration: 'none'
                                                                },
                                                                children: "⚠ Reconnect"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, acc.id, true, {
                                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                        lineNumber: 313,
                                                        columnNumber: 23
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 303,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 299,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 261,
                                columnNumber: 11
                            }, this),
                            errors['accounts'] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "field-error-msg",
                                children: errors['accounts']
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 334,
                                columnNumber: 34
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                        lineNumber: 258,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "composer-section-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "section-label",
                                        style: {
                                            marginBottom: 0
                                        },
                                        children: "Caption"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 340,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '12px',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: isPerPlatform,
                                                onChange: (e)=>setIsPerPlatform(e.target.checked)
                                            }, void 0, false, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 342,
                                                columnNumber: 15
                                            }, this),
                                            "Customize per platform"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 339,
                                columnNumber: 11
                            }, this),
                            bannedWordWarn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "brand-warn-banner",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 349,
                                        columnNumber: 15
                                    }, this),
                                    " Warning: Your caption contains a banned word from your brand kit."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 348,
                                columnNumber: 13
                            }, this),
                            !isPerPlatform ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "per-platform-caption-block",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: "composer-textarea",
                                        placeholder: "What do you want to talk about?",
                                        value: sharedCaption,
                                        onChange: (e)=>setSharedCaption(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 355,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1
                                                },
                                                children: Object.entries(errors).map(([id, err])=>err && id !== 'accounts' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "field-error-msg",
                                                        children: err
                                                    }, id, false, {
                                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 89
                                                    }, this) : null)
                                            }, void 0, false, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 362,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `char-counter ${sharedCaption.length > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$post$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAPTION_LIMITS"].instagram && isInstagramSelected ? 'over-limit' : ''}`,
                                                children: [
                                                    sharedCaption.length,
                                                    " / ",
                                                    isInstagramSelected ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$post$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAPTION_LIMITS"].instagram : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$post$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAPTION_LIMITS"].facebook
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 366,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 361,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 354,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                },
                                children: [
                                    selectedAccounts.map((id)=>{
                                        const acc = accounts.find((a)=>a.id === id);
                                        if (!acc) return null;
                                        const limit = acc.platform === 'instagram' ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$post$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAPTION_LIMITS"].instagram : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$post$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAPTION_LIMITS"].facebook;
                                        const captionText = platformCaptions[id] ?? sharedCaption;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "per-platform-caption-block",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        color: 'var(--text-main)',
                                                        marginBottom: '8px'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                width: 12,
                                                                height: 12,
                                                                display: 'inline-flex'
                                                            },
                                                            children: acc.platform === 'facebook' ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["icons"].facebook : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["icons"].instagram
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                            lineNumber: 382,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        acc.account_name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    className: "composer-textarea",
                                                    placeholder: `Caption for ${acc.account_name}...`,
                                                    value: captionText,
                                                    onChange: (e)=>setPlatformCaptions((prev)=>({
                                                                ...prev,
                                                                [id]: e.target.value
                                                            })),
                                                    onFocus: ()=>setActivePreviewTab(id)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        justifyContent: 'space-between'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                flex: 1
                                                            },
                                                            children: errors[id] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "field-error-msg",
                                                                children: errors[id]
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                                lineNumber: 393,
                                                                columnNumber: 40
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                            lineNumber: 392,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `char-counter ${captionText.length > limit ? 'over-limit' : ''}`,
                                                            children: [
                                                                captionText.length,
                                                                " / ",
                                                                limit
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                            lineNumber: 395,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, id, true, {
                                            fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                            lineNumber: 380,
                                            columnNumber: 19
                                        }, this);
                                    }),
                                    selectedAccounts.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '20px',
                                            textAlign: 'center',
                                            color: 'var(--text-muted)',
                                            fontSize: '13px'
                                        },
                                        children: "Select at least one account to customize captions."
                                    }, void 0, false, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 403,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 372,
                                columnNumber: 13
                            }, this),
                            brandKit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: '16px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: 'var(--text-muted)'
                                        },
                                        children: "Brand Kit Helpers"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 412,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "brand-helper-bar",
                                        style: {
                                            display: 'flex',
                                            gap: '8px',
                                            flexWrap: 'wrap',
                                            marginTop: '8px'
                                        },
                                        children: [
                                            brandKit.default_hashtags?.map((tag, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "brand-pill",
                                                    onClick: ()=>insertText(tag),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                            lineNumber: 416,
                                                            columnNumber: 21
                                                        }, this),
                                                        " ",
                                                        tag.replace('#', '')
                                                    ]
                                                }, `tag-${i}`, true, {
                                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                    lineNumber: 415,
                                                    columnNumber: 19
                                                }, this)),
                                            brandKit.cta_library?.map((cta, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "brand-pill",
                                                    onClick: ()=>insertText(cta),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__["Type"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                            lineNumber: 421,
                                                            columnNumber: 21
                                                        }, this),
                                                        " ",
                                                        cta.length > 20 ? cta.substring(0, 20) + '...' : cta
                                                    ]
                                                }, `cta-${i}`, true, {
                                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                    lineNumber: 420,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 413,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 411,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "composer-section-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "section-label",
                                children: "Media"
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 431,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "media-dropzone",
                                onClick: ()=>fileInputRef.current?.click(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "dropzone-icon-circle",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__["UploadCloud"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                            lineNumber: 438,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 437,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "dropzone-title",
                                        children: "Click or drag files here"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 440,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "dropzone-subtitle",
                                        children: "Supported formats: JPG, PNG, WEBP, MP4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 441,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn-browse-files",
                                        children: "Browse Files"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 442,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        className: "hidden-file-input",
                                        ref: fileInputRef,
                                        multiple: true,
                                        accept: "image/jpeg, image/png, image/webp, video/mp4",
                                        onChange: handleUpload
                                    }, void 0, false, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 443,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 433,
                                columnNumber: 11
                            }, this),
                            isUploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: '12px',
                                    height: '4px',
                                    backgroundColor: 'var(--bg-hover)',
                                    borderRadius: '2px',
                                    overflow: 'hidden'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        height: '100%',
                                        width: `${uploadProgress}%`,
                                        backgroundColor: 'var(--cni-teal-primary)',
                                        transition: 'width 0.3s'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                    lineNumber: 455,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 454,
                                columnNumber: 13
                            }, this),
                            mediaUrls.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "media-thumb-grid",
                                children: mediaUrls.map((url, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "media-thumb-item",
                                        children: [
                                            url.match(/\.(mp4|webm)$/i) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                src: url,
                                                style: {
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 464,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: url,
                                                alt: "Upload"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 466,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    removeMedia(i);
                                                },
                                                style: {
                                                    position: 'absolute',
                                                    top: '4px',
                                                    right: '4px',
                                                    background: 'rgba(0,0,0,0.5)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '4px',
                                                    cursor: 'pointer'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                    lineNumber: 472,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 468,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 462,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 460,
                                columnNumber: 13
                            }, this),
                            isInstagramSelected && mediaUrls.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "instagram-media-warn",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 481,
                                        columnNumber: 15
                                    }, this),
                                    " Instagram requires at least one image or video."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 480,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "composer-section-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "section-label",
                                children: "Schedule"
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 488,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "schedule-field-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "schedule-input-wrapper",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                size: 16,
                                                style: {
                                                    position: 'absolute',
                                                    left: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: 'var(--cni-teal-primary)',
                                                    zIndex: 2
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 491,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "datetime-local",
                                                value: scheduledAt,
                                                onChange: (e)=>setScheduledAt(e.target.value),
                                                min: localIso
                                            }, void 0, false, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 492,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 490,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '12px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: [
                                            "Timezone: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: workspace.timezone
                                            }, void 0, false, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 500,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 499,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 489,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                        lineNumber: 487,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "composer-submit-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "preset-btn",
                                style: {
                                    padding: '10px 16px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    border: '1px solid var(--border-card)',
                                    opacity: isSubmitting ? 0.7 : 1
                                },
                                onClick: ()=>handleSubmit(true),
                                disabled: isSubmitting,
                                children: "Save Draft"
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 507,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn-new-post-header",
                                style: {
                                    padding: '10px 20px',
                                    fontSize: '13px',
                                    opacity: isSubmitting ? 0.7 : 1
                                },
                                onClick: ()=>handleSubmit(false),
                                disabled: isSubmitting,
                                children: isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCcw$3e$__["RefreshCcw"], {
                                            size: 16,
                                            className: "animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                            lineNumber: 523,
                                            columnNumber: 17
                                        }, this),
                                        " Submitting..."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                    lineNumber: 523,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                            lineNumber: 525,
                                            columnNumber: 17
                                        }, this),
                                        " Schedule Post"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                    lineNumber: 525,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 516,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                        lineNumber: 506,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "composer-right-pane",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            marginBottom: '16px'
                        },
                        children: "Live Preview"
                    }, void 0, false, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                        lineNumber: 534,
                        columnNumber: 9
                    }, this),
                    selectedAccounts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "preview-tab-switcher",
                                style: {
                                    marginBottom: '16px'
                                },
                                children: selectedAccounts.map((id)=>{
                                    const acc = accounts.find((a)=>a.id === id);
                                    if (!acc) return null;
                                    const isActive = activePreviewTab === id;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `platform-chip ${isActive ? 'active' : ''}`,
                                        onClick: ()=>setActivePreviewTab(id),
                                        style: {
                                            padding: '8px 16px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            borderRadius: '20px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    width: 14,
                                                    height: 14,
                                                    display: 'inline-flex'
                                                },
                                                children: acc.platform === 'facebook' ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["icons"].facebook : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["icons"].instagram
                                            }, void 0, false, {
                                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                                lineNumber: 550,
                                                columnNumber: 21
                                            }, this),
                                            acc.account_name
                                        ]
                                    }, id, true, {
                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                        lineNumber: 544,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 538,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "preview-device-mockup",
                                children: activePreviewTab && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$workspaces$2f5b$workspaceId$5d2f$composer$2f$PlatformPreview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlatformPreview"], {
                                    platform: accounts.find((a)=>a.id === activePreviewTab)?.platform || 'facebook',
                                    accountName: accounts.find((a)=>a.id === activePreviewTab)?.account_name || 'Account',
                                    caption: isPerPlatform ? platformCaptions[activePreviewTab] || '' : sharedCaption,
                                    mediaUrls: mediaUrls
                                }, void 0, false, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                    lineNumber: 559,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 557,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                        lineNumber: 537,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "preview-device-mockup",
                        style: {
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8fafc',
                            padding: '40px 20px',
                            textAlign: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(0,127,115,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '24px',
                                    color: 'var(--cni-teal-primary)'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                    size: 28
                                }, void 0, false, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                    lineNumber: 571,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 570,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    color: '#0f172a',
                                    marginBottom: '8px'
                                },
                                children: "Your post will appear here"
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 573,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: 'var(--text-muted)',
                                    fontSize: '14px',
                                    maxWidth: '240px',
                                    lineHeight: 1.5
                                },
                                children: "Select an account on the left and start crafting your content to see a live preview."
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                                lineNumber: 574,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                        lineNumber: 569,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
                lineNumber: 533,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/workspaces/[workspaceId]/composer/ComposerClient.tsx",
        lineNumber: 222,
        columnNumber: 5
    }, this);
}
_s(ComposerClient, "PHwSRui71FbCp8ySNtyBxJ2pZFs=");
_c = ComposerClient;
var _c;
__turbopack_context__.k.register(_c, "ComposerClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PlatformPreview",
    ()=>PlatformPreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.mjs [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.mjs [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.mjs [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.mjs [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.mjs [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bookmark.mjs [app-client] (ecmascript) <export default as Bookmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thumbs-up.mjs [app-client] (ecmascript) <export default as ThumbsUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.mjs [app-client] (ecmascript) <export default as Share2>");
'use client';
;
;
function PlatformPreview({ platform, accountName, caption, mediaUrls }) {
    const avatarInitials = accountName.slice(0, 2).toUpperCase();
    // Function to highlight hashtags in Instagram captions
    const formatInstagramCaption = (text)=>{
        if (!text) return null;
        return text.split(/(\s+)/).map((word, i)=>{
            if (word.startsWith('#')) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        color: '#00376b'
                    },
                    children: word
                }, i, false, {
                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                    lineNumber: 22,
                    columnNumber: 11
                }, this);
            }
            return word;
        });
    };
    if (platform === 'facebook') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "preview-fb-card",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "preview-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "preview-author-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "preview-brand-avatar",
                                    style: {
                                        backgroundColor: '#1877F2'
                                    },
                                    children: avatarInitials
                                }, void 0, false, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                    lineNumber: 36,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "preview-brand-title",
                                            children: accountName
                                        }, void 0, false, {
                                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                            lineNumber: 40,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "preview-time-row",
                                            children: [
                                                "Just now ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "meta-dot",
                                                    children: "•"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                                    lineNumber: 42,
                                                    columnNumber: 26
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "preview-globe-icon",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                        size: 12
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                                        lineNumber: 44,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                                    lineNumber: 43,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                            lineNumber: 41,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "preview-edit-btn",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "preview-body-text",
                    style: {
                        whiteSpace: 'pre-wrap'
                    },
                    children: caption || 'Your caption will appear here...'
                }, void 0, false, {
                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this),
                mediaUrls.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "preview-media-frame",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "preview-img-container",
                        children: mediaUrls[0].match(/\.(mp4|webm)$/i) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            src: mediaUrls[0],
                            className: "preview-img",
                            controls: true
                        }, void 0, false, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 63,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: mediaUrls[0],
                            alt: "Post media",
                            className: "preview-img"
                        }, void 0, false, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 65,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                        lineNumber: 60,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                    lineNumber: 59,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fb-action-bar",
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '12px',
                        padding: '8px 16px',
                        borderTop: '1px solid var(--border-light)',
                        color: 'var(--text-muted)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: 500
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__["ThumbsUp"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                    lineNumber: 72,
                                    columnNumber: 113
                                }, this),
                                " Like"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: 500
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                    lineNumber: 73,
                                    columnNumber: 113
                                }, this),
                                " Comment"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: 500
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                    lineNumber: 74,
                                    columnNumber: 113
                                }, this),
                                " Share"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this);
    }
    if (platform === 'instagram') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "preview-ig-card",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "preview-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "preview-author-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "preview-brand-avatar",
                                    style: {
                                        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                        borderRadius: '50%'
                                    },
                                    children: avatarInitials
                                }, void 0, false, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                    lineNumber: 85,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "preview-brand-title",
                                    children: accountName
                                }, void 0, false, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                    lineNumber: 88,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "preview-edit-btn",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this),
                mediaUrls.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "preview-media-frame",
                    style: {
                        borderRadius: 0,
                        borderLeft: 'none',
                        borderRight: 'none'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "preview-img-container",
                        children: mediaUrls[0].match(/\.(mp4|webm)$/i) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            src: mediaUrls[0],
                            className: "preview-img",
                            style: {
                                height: '320px'
                            },
                            controls: true
                        }, void 0, false, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 99,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: mediaUrls[0],
                            alt: "Post media",
                            className: "preview-img",
                            style: {
                                height: '320px'
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 101,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                        lineNumber: 97,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                    lineNumber: 96,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "preview-media-frame",
                    style: {
                        borderRadius: 0,
                        borderLeft: 'none',
                        borderRight: 'none',
                        height: '320px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f2f5'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: 'var(--text-muted)',
                            fontSize: '13px'
                        },
                        children: "Image required for Instagram"
                    }, void 0, false, {
                        fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                        lineNumber: 107,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                    lineNumber: 106,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "ig-action-bar",
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 16px 8px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '16px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                    size: 22
                                }, void 0, false, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                    size: 22
                                }, void 0, false, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                    lineNumber: 114,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                    size: 22
                                }, void 0, false, {
                                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"], {
                            size: 22
                        }, void 0, false, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                    lineNumber: 111,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "preview-body-text",
                    style: {
                        padding: '0 16px 16px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontWeight: 600,
                                marginRight: '6px'
                            },
                            children: accountName
                        }, void 0, false, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                whiteSpace: 'pre-wrap'
                            },
                            children: caption ? formatInstagramCaption(caption) : 'Your caption...'
                        }, void 0, false, {
                            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/workspaces/[workspaceId]/composer/PlatformPreview.tsx",
            lineNumber: 82,
            columnNumber: 7
        }, this);
    }
    return null;
}
_c = PlatformPreview;
var _c;
__turbopack_context__.k.register(_c, "PlatformPreview");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/workspaces/[workspaceId]/composer/data:2aef2c [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "submitPost",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"7864a65467b84fee0f27271c965bb5e6a32e657616":{"name":"submitPost"}},"app/workspaces/[workspaceId]/composer/actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("7864a65467b84fee0f27271c965bb5e6a32e657616", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "submitPost");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/workspaces/[workspaceId]/composer/data:e6df49 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUploadSignedUrl",
    ()=>$$RSC_SERVER_ACTION_1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"706cdbc737e61c9c5a602f095747e9e69bcee81e02":{"name":"getUploadSignedUrl"}},"app/workspaces/[workspaceId]/composer/actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("706cdbc737e61c9c5a602f095747e9e69bcee81e02", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getUploadSignedUrl");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/schemas/post.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CAPTION_LIMITS",
    ()=>CAPTION_LIMITS,
    "PostVariantSchema",
    ()=>PostVariantSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
;
const CAPTION_LIMITS = {
    instagram: 2200,
    facebook: 63206
};
const PostVariantSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    platform: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'facebook',
        'instagram'
    ]),
    caption: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    media_urls: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url()).default([]),
    scheduled_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().datetime().optional()
}).superRefine(_c = (data, ctx)=>{
    // Common scheduled_at validation
    if (data.scheduled_at) {
        if (new Date(data.scheduled_at) < new Date()) {
            ctx.addIssue({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodIssueCode.custom,
                message: 'scheduled_at must not be in the past',
                path: [
                    'scheduled_at'
                ]
            });
        }
    }
    // Instagram validation
    if (data.platform === 'instagram') {
        if (!data.media_urls || data.media_urls.length === 0) {
            ctx.addIssue({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodIssueCode.custom,
                message: 'Instagram variants MUST have at least one media_url',
                path: [
                    'media_urls'
                ]
            });
        }
        if (data.caption && data.caption.length > CAPTION_LIMITS.instagram) {
            ctx.addIssue({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodIssueCode.custom,
                message: `Instagram caption max length is ${CAPTION_LIMITS.instagram.toLocaleString()} chars`,
                path: [
                    'caption'
                ]
            });
        }
    }
    // Facebook validation
    if (data.platform === 'facebook') {
        if (data.caption && data.caption.length > CAPTION_LIMITS.facebook) {
            ctx.addIssue({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodIssueCode.custom,
                message: `Facebook caption max length is ${CAPTION_LIMITS.facebook.toLocaleString()} chars`,
                path: [
                    'caption'
                ]
            });
        }
    }
});
_c1 = PostVariantSchema;
var _c, _c1;
__turbopack_context__.k.register(_c, "PostVariantSchema$z.object({\n  platform: z.enum(['facebook', 'instagram']),\n  caption: z.string().optional(),\n  media_urls: z.array(z.string().url()).default([]),\n  scheduled_at: z.string().datetime().optional()\n}).superRefine");
__turbopack_context__.k.register(_c1, "PostVariantSchema");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0g5roqk._.js.map
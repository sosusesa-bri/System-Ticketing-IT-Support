const fs = require('fs');
let createContent = fs.readFileSync('resources/js/pages/Tickets/Create.jsx', 'utf8');

// 1. Rename Component
createContent = createContent.replace('export default function TicketCreate({ categories }) {', 'export default function TicketEdit({ ticket, categories }) {');

// 2. Replace Initial Data Logic
createContent = createContent.replace(/    \/\/ Check if we have a saved draft[\s\S]*?const initialData = getInitialDraft\(\);/, `    const initialData = {
        title: ticket.title || '',
        category_id: ticket.category_id || '',
        priority: ticket.priority || 'medium',
        description: ticket.description || '',
        dynamic_fields: ticket.dynamic_fields || {}
    };`);

// 3. Update useForm
createContent = createContent.replace(/const { data, setData, post, processing, errors, transform } = useForm\(\{[\s\S]*?status: 'open',\n    \}\);/, `const { data, setData, post, processing, errors, transform } = useForm({
        _method: 'PUT',
        title: initialData.title,
        category_id: initialData.category_id,
        priority: initialData.priority,
        description: initialData.description,
        dynamic_fields: initialData.dynamic_fields || {},
        attachments: [],
        remove_attachments: [],
        status: ticket.status || 'draft',
    });
    const [removeAttachmentIds, setRemoveAttachmentIds] = useState([]);
    const existingAttachments = (ticket.attachments || []).filter(
        (a) => !removeAttachmentIds.includes(a.id)
    );
    const removeExistingAttachment = (id) => {
        const updated = [...removeAttachmentIds, id];
        setRemoveAttachmentIds(updated);
        setData('remove_attachments', updated);
    };`);

// 4. Update form submissions
createContent = createContent.replace(/post\('\/tickets'/g, 'post(`/tickets/${ticket.id}`');
createContent = createContent.replace(/localStorage\.removeItem\('ticket_draft'\);/g, '');
createContent = createContent.replace(/localStorage\.setItem\('ticket_draft'.*?\);/gs, '');

// 5. Update header texts
createContent = createContent.replace(/\{t\('tc_createNewTicket'\)\}/g, '{t(\'td_editDraft\')} + \' - \' + ticket.ticket_number');
createContent = createContent.replace(/title=\{t\('tc_createNewTicket'\)\}/g, 'title={`${t(\'td_editDraft\')} - ${ticket.ticket_number}`}');

// 6. Insert existing attachments into the view
const newAttachmentsSection = `
                                {/* Existing Attachments */}
                                {existingAttachments.length > 0 && (
                                    <div className="space-y-1.5 mb-4">
                                        <label className="block text-sm font-medium text-neutral-700">
                                            {t('td_attachments')}
                                        </label>
                                        <div className="space-y-2">
                                            {existingAttachments.map((att) => {
                                                const Icon = getFileIcon(att.mime_type);
                                                return (
                                                    <div
                                                        key={att.id}
                                                        className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg bg-neutral-50"
                                                    >
                                                        <Icon className="h-5 w-5 text-neutral-400 shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-neutral-900 truncate">
                                                                {att.original_name}
                                                            </p>
                                                            <p className="text-xs text-neutral-500">
                                                                {att.formatted_size}
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingAttachment(att.id)}
                                                            className="p-1.5 text-neutral-400 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
`;
createContent = createContent.replace(/\{\/\* File Upload \*\/\}/, newAttachmentsSection + '\n                                {/* File Upload */}');

// Write back
fs.writeFileSync('resources/js/pages/Tickets/Edit.jsx', createContent);
console.log('Edit.jsx updated successfully.');

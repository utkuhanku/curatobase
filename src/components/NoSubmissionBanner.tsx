export function NoSubmissionBanner() {
    return (
        <div className="w-full bg-deep-void border-b border-glass-border py-3 text-center sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-mono">
                <span className="text-electric-blue font-bold">CuratoBase Agent</span> v1.0 • No Submissions • No Payments • Logic Only
            </p>
        </div>
    );
}

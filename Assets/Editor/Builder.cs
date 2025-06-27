using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using UnityEditor;
using UnityEngine;
using VRC.Udon.Editor;

internal static class Builder {
    [MenuItem("HoshinoLabs/UdonExposed/Generate UdonExposed", priority = 100)]
    public static async void Build() {
        await Task.Run(async () => {
            var udonExposedDir = Path.Combine(Application.dataPath, "..", "UdonExposed", $"v{GetVRCSDKWorldVersion()}");
            if (Directory.Exists(udonExposedDir)) {
                Directory.Delete(udonExposedDir, true);
            }
            Directory.CreateDirectory(udonExposedDir);

            var progressId = Progress.Start("Generate UdonExposed");

            var nodeRegistries = UdonEditorManager.Instance.GetNodeRegistries()
                .ToArray();
            for(var i = 0; i < nodeRegistries.Length; i++) {
                var nodeRegistry = nodeRegistries[i];
                Progress.Report(progressId, i, nodeRegistries.Length, $"generating for '{nodeRegistry.Key}'");
                var udonExposedPath = Path.Combine(udonExposedDir, $"{nodeRegistry.Key}.txt");
                var writer = new StreamWriter(udonExposedPath, false);
                foreach (var nodeDefinition in nodeRegistry.Value.GetNodeDefinitions()) {
                    writer.WriteLine(nodeDefinition.fullName);
                }
                writer.Flush();
                writer.Close();
                await Task.Delay(0);
            }

            Progress.Finish(progressId, Progress.Status.Succeeded);
        });
    }

    static string GetVRCSDKWorldVersion() {
        var json = File.ReadAllText(Path.Combine(Application.dataPath, "..", "Packages", "com.vrchat.worlds", "package.json"));
        var obj = JsonConvert.DeserializeObject<JObject>(json);
        return obj.GetValue("version").ToString();
    }
}

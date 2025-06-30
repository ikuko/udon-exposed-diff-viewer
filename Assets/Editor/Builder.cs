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
#if UNITY_2022_1_OR_NEWER
        await Task.Run(async () => {
#endif
        var udonExposedDir = Path.Combine(Application.dataPath, "..", "UdonExposed", $"v{GetVRCSDKWorldVersion()}");
            if (Directory.Exists(udonExposedDir)) {
                Directory.Delete(udonExposedDir, true);
            }
            Directory.CreateDirectory(udonExposedDir);

#if UNITY_2022_1_OR_NEWER
            var progressId = Progress.Start("Generate UdonExposed");
#endif

            var nodeRegistries = UdonEditorManager.Instance.GetNodeRegistries()
                .ToArray();
            for(var i = 0; i < nodeRegistries.Length; i++) {
                var nodeRegistry = nodeRegistries[i];
#if UNITY_2022_1_OR_NEWER
                Progress.Report(progressId, i, nodeRegistries.Length, $"generating for '{nodeRegistry.Key}'");
#endif
                var udonExposedPath = Path.Combine(udonExposedDir, $"{nodeRegistry.Key}.txt");
                var writer = new StreamWriter(udonExposedPath, false);
                foreach (var nodeDefinition in nodeRegistry.Value.GetNodeDefinitions()) {
                    writer.WriteLine(nodeDefinition.fullName);
                }
                writer.Flush();
                writer.Close();
#if UNITY_2022_1_OR_NEWER
                await Task.Delay(0);
#endif
            }

#if UNITY_2022_1_OR_NEWER
            Progress.Finish(progressId, Progress.Status.Succeeded);
#endif
#if UNITY_2022_1_OR_NEWER
        });
#endif
    }

    static string GetVRCSDKWorldVersion() {
        var json = File.ReadAllText(Path.Combine(Application.dataPath, "..", "Packages", "com.vrchat.worlds", "package.json"));
        var obj = JsonConvert.DeserializeObject<JObject>(json);
        return obj.GetValue("version").ToString();
    }
}
